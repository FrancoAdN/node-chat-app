
const socket = io('http://localhost:1234')

socket.emit('server')

socket.on('server', (auth) => {
    if (auth)
        document.getElementById('main-content-div').style.display = 'block'
    else
        document.getElementById('main-content-div').style.display = 'none'
})

function openConv(conv) {
    console.log('open new conv ' + conv)

    for (let elem of document.getElementsByClassName('chat'))
        elem.style.display = 'none'

    document.getElementById(`chat-id-${conv}`).style.display = 'block'

}

function keyUp(event, id) {
    if (event.keyCode === 13)
        send_msg(id)
}

function send_msg(id) {

    let doc = document.getElementById(`in-msg-${id}`).value
    const msg = {
        text: doc,
        to: id
    }
    socket.emit('msg', msg)
    document.getElementById(`in-msg-${id}`).value = ''
    const today = new Date()
    const time = `${today.getHours()}:${today.getMinutes()}`
    const msg_from_server = `<li class="clearfix">
    <div class="message-data align-right">
    <span class="message-data-time"> ${time}</span> &nbsp; &nbsp;
    <span class="message-data-name" >Server </span> <i class="fa fa-circle me"></i>
    
    </div>
    <div class="message other-message float-right">
    ${msg.text}
    </div>
    </li>`

    document.getElementById(`chat-history-${id}`).innerHTML += msg_from_server
}


socket.on('new_client', (data) => {
    console.log(`new client recieve ${data}`)

    const new_client = `<li class="clearfix" id="cli-${data}" onclick="openConv(${data})">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg" alt="avatar" />
    <div class="about">
    <div class="name">Chat client ${data}</div>
    <div class="status">
        <i class="fa fa-circle online"></i> online
    </div>
    </div>
    </li>`

    const new_chat_content = `<div class="chat" id="chat-id-${data}">
    <div class="chat-header clearfix">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg" alt="avatar" />
    
    <div class="chat-about">
        <div class="chat-with">Chat chat client ${data}</div>
        <!--<div class="chat-num-messages">already 0 messages</div>-->
    </div>
    
    </div> 

    <div class="chat-history" id="chat-history-${data}">
    <ul>
    </ul>
    
    </div> <!-- end chat-history -->

    <div class="chat-message clearfix">
    <textarea name="message-to-send" placeholder ="Type your message" rows="3" id="in-msg-${data}" onkeyup="keyUp(event, ${data})"></textarea>
            
    <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
    <i class="fa fa-file-image-o"></i>
    
    <button onclick="send_msg(${data})">Send</button>

    </div> <!-- end chat-message -->

    </div>`



    document.getElementById('contact-list').innerHTML += new_client

    document.getElementById('main-content-div').innerHTML += new_chat_content

    for (let elem of document.getElementsByClassName('chat'))
        elem.style.display = 'none'

})

socket.on('cli_disconnect', (data) => {
    console.log('disconnect ' + data)
    document.getElementById(`cli-${data}`).remove()
    document.getElementById(`chat-id-${data}`).remove()
})

socket.on('msg', (msg) => {
    const today = new Date()
    const time = `${today.getHours()}:${today.getMinutes()}`


    const msg_from_client = `<li>
    <div class="message-data">
    <span class="message-data-name"><i class="fa fa-circle online"></i> Client</span>
    <span class="message-data-time">${time}</span>
    </div>
    <div class="message my-message">
    ${msg.text}
    </div>
    </li>`

    document.getElementById(`chat-history-${msg.from}`).innerHTML += msg_from_client



})



