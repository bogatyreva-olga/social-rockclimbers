function sendRegistrationForm() {
    const form = $("#registration-form");
    if (!form.get(0).checkValidity()) {
        const message = $('#message');
        message.text("Invalid form");
        message.show();
        return;
    }

    const email = $('#email');
    const pass = $('#password');
    let data = {
        email: email.val(),
        password: pass.val()
    };

    let messageElements = $(".message-js");
    $(messageElements).each(function (i, elem) {
        $(elem).text('');
    })

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
                    let errorMsgElement = $("error-" + error.param + "-js");
                    errorMsgElement.text(error.msg);
                    errorMsgElement.show();
                }
                return;
            }
            showModal("Registration successfully", res.message);
            $('#email').text('');
            $('#password').text('');
        });
    return undefined;
}

function getFeedbackMessageValue() {
    return $('#feedback-message').val();
}

function getNameUserValue() {
    return $('#name-user').val();
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
    return $("#category").val();
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
            const filterElement = $("#category-filter");
            filterElement.value = response.categoryId;
            updateFeedbackMessagesWithCategoryFilter();

            $("#name-user").val('');
            $('#feedback-message').val('');
        });

    return undefined;
}

function getNodeFromFeedbackMessage(feedbackMessage) {
    let feedbackMessageElement = $('<div/>', {
        class: 'message-item'
    });
    let dateElement = $('<div/>', {
        text: dateFormat(feedbackMessage.createdAt),
        class: 'date-message'
    });
    $(feedbackMessageElement).append(dateElement);

    let userMessageElement = $('<div/>', {
        class: 'user-message'
    });
    let paragraphMessageElement = $('<p/>', {
        class: 'text-break',
        text: feedbackMessage.message
    });
    userMessageElement.append(paragraphMessageElement);
    feedbackMessageElement.append(userMessageElement);

    let userNameElement = $('<div/>', {
        text: feedbackMessage.userName,
        class: 'user-name'
    });
    feedbackMessageElement.append(userNameElement);

    return feedbackMessageElement;
}

function updateFeedbackMessagesWithCategoryFilter() {
    let categoryId = $("#category-filter").val();
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/feedback/messages?categoryId=" + categoryId, true)
    xhr.responseType = "json";
    xhr.onload = function () {
        let response = xhr.response;
        let feedbackMessagesData = response.feedbackMessages;

        const feedbackMessagesElement = $('#feedback-messages');
        feedbackMessagesElement.html('');

        for (let i = 0; i < feedbackMessagesData.length; i++) {
            let feedbackMessageElement = getNodeFromFeedbackMessage(feedbackMessagesData[i])
            feedbackMessagesElement.append(feedbackMessageElement);
        }
    }
    xhr.send();
    return undefined;
}

let feedbackCategories = [];

function updateFeedbackCategories() {
    $.get("/feedback/categories", function( response ) {
        feedbackCategories = response.categories;
    })
}

function getCategoryNameById(categoryId) {
    let data = feedbackCategories.filter(function (category) {
        return category.id === parseInt(categoryId);
    });
    return data[0].name;
}

function showModal(title, content) {
    let modalElement = document.getElementById("exampleModal");
    modalElement.querySelector("#modal-title").html(title);
    modalElement.querySelector("#modal-body").html(content);
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
