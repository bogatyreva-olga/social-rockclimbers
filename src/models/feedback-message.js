class FeedbackMessage {
    userName;
    message;
    categoryId;
    createdAt;

    constructor(userName, message, categoryId) {
        this.userName = userName;
        this.message = message;
        this.categoryId = categoryId;
        this.createdAt = Math.round((new Date().getTime()) / 1000);
    }
}

module.exports = FeedbackMessage;
