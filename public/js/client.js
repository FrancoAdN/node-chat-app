const socket = io('ws://localhost:8080', { transports: ['websocket', 'polling'] })

socket.emit('client');

socket.on('client', auth => {
    if (auth) document.getElementById('launch').style.display = 'block';
    else document.getElementById('launch').style.display = 'none';
});

socket.on('sv_disconnect', () => {
    socket = null;
    document.getElementById('chat').style.display = 'none';
});

socket.on('msg', data => {
    const msg_from_server = `<div class="smith-conversation-part smith-conversation-part-admin">
        <div class="smith-comment-container smith-comment-container-admin">
            <div class="smith-comment e1">
                <div class="smith-blocks">
                    <div class="smith-block smith-block-paragraph">
                        ${data}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>`;
    document.getElementById('content').innerHTML += msg_from_server;
});

function keyUp(event) {
    if (event.keyCode === 13) send_msg();
}

function send_msg() {
    let data = document.getElementById('msg-box').value;
    const msg_from_client = `<div class="smith-conversation-part smith-conversation-part-guest">
        <div class="smith-comment-container smith-comment-container-guest">
            <div class="smith-comment e1 background-brand f-right">
                <div class="smith-blocks ">
                    <div class="smith-block smith-block-paragraph" style="color: #fff;">${data}</div>
                </div>
            </div>
        </div>
    </div>`;

    socket.emit('msg', data);
    document.getElementById('content').innerHTML += msg_from_client;
    document.getElementById('msg-box').value = '';
}
