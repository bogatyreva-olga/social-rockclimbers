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
    });

    $.ajax({
        url: '/registration',
        type: 'post',
        data: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (data) {
            showModal("Registration successfully", data.message);
            $('#email').val('');
            $('#password').val('');
        },
        error: function (data) {
            let res = data.responseJSON;
            for (let i = 0; i < res.errors.length; i++) {
                let error = res.errors[i];
                let errorMsgElement = $("#error-" + error.param + "-js");
                errorMsgElement.text(error.msg);
                errorMsgElement.show();
            }
        }
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

    $.ajax({
        url: '/feedback/messages',
        type: 'post',
        data: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (data) {
            const filterElement = $("#category-filter");
            filterElement.val(data.categoryId);
            updateFeedbackMessagesWithCategoryFilter();

            $("#name-user").val('');
            $('#feedback-message').val('');
        }
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

    $.ajax({
        url: '/feedback/messages?categoryId=' + categoryId,
        method: 'get',
        success: function (data) {
            let feedbackMessagesData = data.feedbackMessages;

            const feedbackMessagesElement = $('#feedback-messages');
            feedbackMessagesElement.html('');

            for (let i = 0; i < feedbackMessagesData.length; i++) {
                let feedbackMessageElement = getNodeFromFeedbackMessage(feedbackMessagesData[i]);
                feedbackMessagesElement.append(feedbackMessageElement);
            }
        }
    });

    return undefined;
}

let feedbackCategories = [];

function updateFeedbackCategories() {
    $.get("/feedback/categories", function (response) {
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
    let modalElement = $("#exampleModal");
    modalElement.find("#modal-title").html(title);
    modalElement.find("#modal-body").html(content);
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
