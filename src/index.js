// index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const {body, validationResult} = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const FeedbackMessage = require('./models/feedback-message');
const User = require('./models/user');
const md5 = require("md5");

const feedbackMessagesFileName = path.join(__dirname, '../data/feedback-messages.data');
const usersFileName = path.join(__dirname, '../data/users.data');

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(cookieParser());

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: require('./helpers/handlebars-helpers'),
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/', (request, response) => {
    response.render('home', {
        name: 'John'
    });
});

app.get('/users', (request, response) => {
    response.render('users', {
        users: [
            {"id": 1, "name": "John"},
            {"id": 2, "name": "Mike"},
            {"id": 3, "name": "Olya"},
        ]
    });
});

app.get('/sign-in', (request, response) => {
    response.render('sign-in');
});

app.get('/sign-up', (request, response) => {
    response.render('sign-up');
});

const minPasswordLength = 6;
app.post('/sign-up',
    body('email').isEmail().withMessage("Invalid email").normalizeEmail(),
    body('password').isLength({min: minPasswordLength}).withMessage("Invalid min length: " + minPasswordLength + " symbols"),
    (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        let data = getUsers();
        for (let i = 0; i < data.length; i++) {
            if (data[i].email === request.body.email) {
                return response.status(400).json({
                    success: false,
                    errors: [{
                        value: request.body.email,
                        msg: "User already exist",
                        param: "email",
                        location: "body",
                    }]
                });
            }
        }

        let user = new User(request.body.email, request.body.password);
        data.push(user);

        fs.writeFileSync(usersFileName, JSON.stringify(data), () => {
        });

        response.status(200).json({
            success: true,
            message: 'User sign-up successful',
        });

    });


app.post('/sign-in',
    body('email').isEmail().withMessage("Invalid email").normalizeEmail(),
    body('password').isLength({min: minPasswordLength}).withMessage("Invalid min length: " + minPasswordLength + " symbols"),
    (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        let data = getUsers();

        let findUser = null;
        for (let i = 0; i < data.length; i++) {
            if (data[i].email === request.body.email) {
                findUser = data[i];
                break;
            }
        }

        if (!findUser) {
            return response.status(400).json({
                success: false,
                errors: [{
                    value: request.body.email,
                    msg: "User not exist",
                    param: "email",
                    location: "body",
                }]
            });
        }

        let md5ReqPass = md5(request.body.password + findUser.salt);

        if (md5ReqPass !== findUser.password) {
            return response.status(400).json({
                success: false,
                errors: [{
                    value: request.body.email,
                    msg: "User pass is not valid",
                    param: "email",
                    location: "body",
                }]
            });
        }

        response.cookie('cookieName', 'cookieValue', {maxAge: 36000000});

        response.status(200).json({
            success: true,
            message: 'User sign in successful',
        });

    });

app.get('/feedback', (request, response) => {
    response.render('feedback', {
        feedbackMessages: getFeedbackMessagesByCategoryId(),
        categories: getFeedbackCategories(),
    });
});

app.post('/feedback/messages', (request, response) => {
    console.log(request.body);
    let data = getFeedbackMessagesByCategoryId();
    let newFeedbackMessage = new FeedbackMessage(request.body.userName, request.body.message, request.body.categoryId);
    data.push(newFeedbackMessage);

    fs.writeFileSync(feedbackMessagesFileName, JSON.stringify(data), () => {
    });

    response.json(newFeedbackMessage);
});

app.get('/feedback/messages', (request, response) => {
    response.json({
        feedbackMessages: getFeedbackMessagesByCategoryId(request.query.categoryId),
    });
});

app.get('/feedback/categories', (request, response) => {
    response.json({
        categories: getFeedbackCategories(),
    });
});

function getFeedbackMessagesByCategoryId(categoryId) {
    let data = [];
    if (!fs.existsSync(feedbackMessagesFileName)) {
        return data;
    }
    let fileData = fs.readFileSync(feedbackMessagesFileName);
    if (fileData) {
        data = JSON.parse(fileData);
    }
    if (categoryId > 0) {
        return data.filter(function (elem) {
            return elem.categoryId === categoryId;
        });
    }
    return data;
}

function getUsers() {
    let data = [];
    if (!fs.existsSync(usersFileName)) {
        return data;
    }
    let fileData = fs.readFileSync(usersFileName);
    if (fileData) {
        data = JSON.parse(fileData);
    }
    return data;
}

function getFeedbackCategories() {
    return [
        {
            id: 1,
            name: "Магазин",
        },
        {
            id: 2,
            name: "Сайт",
        },
        {
            id: 3,
            name: "Рассписание",
        },
    ];
}

app.listen(3001);
