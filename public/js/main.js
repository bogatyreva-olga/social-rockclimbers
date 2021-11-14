function sendRegistrationForm() {
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    let data = {
        email: email.value,
        password: pass.value
    };

    fetch("/registration", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(function (res) {
            console.log(res);
            const respMessage = document.getElementById('response-message');
            respMessage.innerText = res.message;
        })
        .catch(function (res) {
            console.log(res);
            const respMessage = document.getElementById('response-message');
            respMessage.innerText = res.message;
        });
    return undefined;
}

function getChatMessageValue() {
    return document.getElementById('chat-message').value;
}

function sendChatMessage() {
    let data = {
        chatMessage: getChatMessageValue(),
    };

    fetch("/chat/messages", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(function (response) {
            console.log(response);
            const chatMessagesElement = document.getElementById('chat-messages');
            let chatMessageElement = document.createElement("div");
            chatMessageElement.innerText = getChatMessageValue();
            chatMessagesElement.appendChild(chatMessageElement);
        });

    return undefined;
}

function refreshChatMessages() {
    fetch("/chat/messages", {
        method: "GET",
    })
        .then(res => res.json())
        .then(function (response) {
            let chatMessagesData = response.chatMessages;

            const chatMessagesElement = document.getElementById('chat-messages');
            chatMessagesElement.innerHTML = '';

            for (let i = 0; i < chatMessagesData.length; i++) {
                let chatMessageElement = document.createElement("div");
                chatMessageElement.innerText = chatMessagesData[i].chatMessage;
                chatMessagesElement.appendChild(chatMessageElement);
            }
        });

    return undefined;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitRegistrationButton = document.getElementById('submit-registration');
    if (submitRegistrationButton) {
        submitRegistrationButton.addEventListener('click', sendRegistrationForm);
    }

    const sendChatMessageButton = document.getElementById('send-chat-message');
    if (sendChatMessageButton) {
        sendChatMessageButton.addEventListener('click', sendChatMessage);
        setInterval(refreshChatMessages, 5000);
    }
});