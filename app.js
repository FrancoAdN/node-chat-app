//#region required things
const express = require('express')
require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const socket = require('socket.io')
//#endregion

//#region  config
const app = express()
const server = app.listen(process.env.PORT,
    () => console.log('Server running on port ' + process.env.PORT))
const io = socket(server)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.G_EMAIL,
        pass: process.env.G_PWD
    }
})

//#endregion

//#region parsers
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static('public'))
//#endregion

//#region requests
app.get('/', (req, resp) =>
    resp.sendFile(path.join(__dirname + '/public/index.html')))

app.post('/contact', (req, resp) => {
    const mail = req.body

    const mailOptions = {
        from: process.env.G_EMAIL,
        to: 'francoadinapoli@gmail.com;tomasveratec@gmail.com;',
        subject: `${mail.subject} - SPICY`,
        text: `From: ${mail.name}\n
        Email: ${mail.email}\n
        Phone: ${mail.phone}\n\n${mail.message}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            resp.send({ status: false })
            console.error(error)
        } else
            resp.json({ status: true })

    })
})


app.get('/chat', (req, resp) =>
    resp.sendFile(path.join(__dirname + '/public/html/chat.html')))

app.get('/client', (req, resp) =>
    resp.sendFile(path.join(__dirname + '/public/html/client.html')))

//#endregion

//#region chat

let sv
let client = []
let cont_clients = 0

io.sockets.on('connection', (socket) => {

    socket.emit('new_con', { id: socket.id })
    console.log('new ' + socket.id)

    socket.on('server', () => {
        if (sv)
            socket.emit('server', false)
        else {
            sv = socket
            console.log('NEW SERVER CONNECTED')
            sv.emit('server', true)
        }
    })

    socket.on('client', () => {
        if (sv) {
            cont_clients++
            //new client
            const cli = {
                id: cont_clients,
                socket: socket
            }
            client.push(cli)
            console.log('new client connected')
            socket.emit('client', true)
            sv.emit('new_client', cont_clients)

        } else
            socket.emit('client', false)
    })

    socket.on('msg', (msg) => {
        if (socket.id === sv.id) {
            //MESSAGGE FROM SERVER TO CLIENT
            for (let c of client) {
                if (c.id === msg.to) {
                    c.socket.emit('msg', msg.text)
                    break
                }
            }
        } else {
            //MESSAGGE FROM CLIENT TO SERVER
            for (let c of client) {
                if (c.socket.id === socket.id) {
                    sv.emit('msg', { from: c.id, text: msg })
                    break
                }
            }
        }
    })

    socket.on('disconnect', () => {
        if (sv && socket.id === sv.id) {
            sv = null
            console.log('SERVER DISCONNECTED')
            for (let c of client)
                c.socket.emit('sv_disconnect')
            client = []
        } else {
            for (let i = 0; i < client.length; i++) {
                const cli = client[i]
                console.log('client disconnected')
                if (cli.socket.id === socket.id) {
                    if (sv)
                        sv.emit('cli_disconnect', cli.id)
                    client.splice(i, 1)
                    if (client.length == 0)
                        cont_clients = 0
                }
            }
        }
    })


})







//#endregion





