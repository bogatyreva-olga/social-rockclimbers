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

function getTextDataFromFeedbackMessage(feedbackMessage) {
    return feedbackMessage.userName + " - " + feedbackMessage.message + " - " + dateFormat(feedbackMessage.createdAt) + " - " + getCategoryNameById(feedbackMessage.categoryId);
}

function updateFeedbackMessagesWithCategoryFilter() {
    let categoryId = document.getElementById("category-filter").value;
    fetch("/feedback/messages?categoryId=" + categoryId, {
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

function showModal(title, content) {
    let modalElement = document.getElementById("exampleModal");
    modalElement.querySelector("#modal-title").innerHTML = title;
    modalElement.querySelector("#modal-body").innerHTML = content;
    let myModal = new bootstrap.Modal(modalElement, {});

    myModal.show();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitRegistrationButton = document.getElementById('submit-registration');
    if (submitRegistrationButton) {
        submitRegistrationButton.addEventListener('click', sendRegistrationForm);
    }

    const sendFeedbackMessageButton = document.getElementById('send-feedback-message');
    if (sendFeedbackMessageButton) {
        sendFeedbackMessageButton.addEventListener('click', sendFeedbackMessage);
        setInterval(updateFeedbackMessagesWithCategoryFilter, 15000);
        updateFeedbackCategories();
    }

    const filterCategorySelect = document.getElementById("category-filter");
    if (filterCategorySelect) {
        filterCategorySelect.addEventListener('change', updateFeedbackMessagesWithCategoryFilter);
    }
});
