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
        });
    return undefined;
}

function getFeedbackMessageValue() {
    return document.getElementById('feedback-message').value;
}

function getNameUserValue() {
    return document.getElementById("name-user").value;
}

function dateFormat(timestamp) {
    let date = new Date(timestamp * 1000);
    console.log(date);
    let year = date.getFullYear();
    let month = "0" + (date.getMonth() + 1);
    let day = "0" + date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hours + ':' + minutes.substr(-2);
}

function getCategoryId() {
    return document.getElementById("category").value;
}

function sendFeedbackMessage() {
    let data = {
        feedbackMessage: getFeedbackMessageValue(),
        nameUser: getNameUserValue(),
        categoryId: getCategoryId(),
    };

    fetch("/feedback/messages", {
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
            const feedbackMessagesElement = document.getElementById('feedback-messages');
            let feedbackMessageElement = document.createElement("div");
            feedbackMessageElement.innerText = getTextDataFromFeedbackMessage(response);
            feedbackMessagesElement.appendChild(feedbackMessageElement);
            document.getElementById("name-user").value = "";
            document.getElementById('feedback-message').value = "";
        });

    return undefined;
}

function getTextDataFromFeedbackMessage(feedbackMessage) {
    return feedbackMessage.nameUser + " - " + feedbackMessage.feedbackMessage + " - " + dateFormat(feedbackMessage.createdAt) + " - " + getCategoryNameById(feedbackMessage.categoryId);
}

function refreshFeedbackMessages() {
    fetch("/feedback/messages", {
        method: "GET",
    })
        .then(res => res.json())
        .then(function (response) {
            let feedbackMessagesData = response.feedbackMessages;

            const feedbackMessagesElement = document.getElementById('feedback-messages');
            feedbackMessagesElement.innerHTML = '';

            for (let i = 0; i < feedbackMessagesData.length; i++) {
                let feedbackMessageElement = document.createElement("div");
                feedbackMessageElement.innerText = getTextDataFromFeedbackMessage(feedbackMessagesData[i]);
                feedbackMessagesElement.appendChild(feedbackMessageElement);
            }
        });

    return undefined;
}

feedbackCategories = [];

function updateFeedbackCategories() {
    fetch("/feedback/categories", {
        method: "GET",
    })
        .then(res => res.json())
        .then(function (response) {
            feedbackCategories = response.categories;
        });
}

function getCategoryNameById(categoryId) {
    let data = feedbackCategories.filter(function (category) {
        return category.id === parseInt(categoryId);
    });
    return data[0].name;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitRegistrationButton = document.getElementById('submit-registration');
    if (submitRegistrationButton) {
        submitRegistrationButton.addEventListener('click', sendRegistrationForm);
    }

    const sendFeedbackMessageButton = document.getElementById('send-feedback-message');
    if (sendFeedbackMessageButton) {
        sendFeedbackMessageButton.addEventListener('click', sendFeedbackMessage);
        setInterval(refreshFeedbackMessages, 15000);
        updateFeedbackCategories();
    }
});
