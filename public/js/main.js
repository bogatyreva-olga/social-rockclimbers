function sendRegistrationForm() {
    const form = document.getElementById("registration-form");
    if (!form.checkValidity()) {
        const message = document.getElementById('message');
        message.innerText = "Invalid form";
        message.style.display = "block";
        return;
    }

    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    let data = {
        email: email.value,
        password: pass.value
    };
    let messageElements = document.querySelectorAll(".message-js");
    for (let i = 0; i < messageElements.length; i++) {
        messageElements[i].innerText = "";
    }

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
            if (!res.success) {
                for (let i = 0; i < res.errors.length; i++) {
                    let error = res.errors[i];
                    let errorMsgElement = document.getElementById("error-" + error.param + "-js");
                    errorMsgElement.innerText = error.msg;
                    errorMsgElement.style.display = "block";
                }
                return;
            }
            showModal("Registration successfully", res.message);
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
        message: getFeedbackMessageValue(),
        userName: getNameUserValue(),
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
            const filterElement = document.getElementById("category-filter");
            console.log(response.categoryId);
            filterElement.value = response.categoryId;
            updateFeedbackMessagesWithCategoryFilter();

            document.getElementById("name-user").value = "";
            document.getElementById('feedback-message').value = "";
        });

    return undefined;
}

function getNodeFromFeedbackMessage(feedbackMessage) {
    let feedbackMessageElement = document.createElement("div");
    feedbackMessageElement.classList.add("message-item");

    let dateElement = document.createElement("div");
    dateElement.innerText = dateFormat(feedbackMessage.createdAt);
    dateElement.classList.add("date-message");
    feedbackMessageElement.appendChild(dateElement);

    let userMessageElement = document.createElement("div");
    userMessageElement.classList.add("user-message");
    let paragraphMessageElement = document.createElement("p");
    paragraphMessageElement.classList.add("text-break");
    paragraphMessageElement.innerText = feedbackMessage.message;
    userMessageElement.appendChild(paragraphMessageElement);
    feedbackMessageElement.appendChild(userMessageElement);

    let userNameElement = document.createElement("div");
    userNameElement.innerText = feedbackMessage.userName;
    userNameElement.classList.add("user-name");
    feedbackMessageElement.appendChild(userNameElement);

    return feedbackMessageElement;
}

function updateFeedbackMessagesWithCategoryFilter() {
    let categoryId = document.getElementById("category-filter").value;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/feedback/messages?categoryId=" + categoryId, true)
    xhr.responseType = "json";
    xhr.onload = function () {
        let response = xhr.response;
        let feedbackMessagesData = response.feedbackMessages;

        const feedbackMessagesElement = document.getElementById('feedback-messages');
        feedbackMessagesElement.innerHTML = '';

        for (let i = 0; i < feedbackMessagesData.length; i++) {
            let feedbackMessageElement = getNodeFromFeedbackMessage(feedbackMessagesData[i])
            feedbackMessagesElement.appendChild(feedbackMessageElement);
        }
    }
    xhr.send();
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

function showModal(title, content) {
    let modalElement = document.getElementById("exampleModal");
    modalElement.querySelector("#modal-title").innerHTML = title;
    modalElement.querySelector("#modal-body").innerHTML = content;
    let myModal = new bootstrap.Modal(modalElement, {});

    myModal.show();
}

$(document).ready(function () {

    const submitRegistrationButton = $('#submit-registration');
    if (submitRegistrationButton) {
        $(submitRegistrationButton).click(sendRegistrationForm);
    }

    const sendFeedbackMessageButton = $('#send-feedback-message');

    if (sendFeedbackMessageButton) {
        $(sendFeedbackMessageButton).click(sendFeedbackMessage);
        setInterval(updateFeedbackMessagesWithCategoryFilter, 15000);
        updateFeedbackCategories();
        updateFeedbackMessagesWithCategoryFilter();
    }

    const filterCategorySelect = $("#category-filter");
    if (filterCategorySelect) {
        $(filterCategorySelect).change(updateFeedbackMessagesWithCategoryFilter);
    }
});
