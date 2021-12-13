const md5 = require('md5');

class User {
    email;
    salt;
    password;
    createdAt;

    constructor(email, password) {
        this.email = email;
        this.salt = (Math.random() + 1).toString(36).substring(7);
        this.password = md5(password + this.salt);
        this.createdAt = Math.round((new Date().getTime()) / 1000);
    }
}

module.exports = User;
