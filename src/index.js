// index.js
console.log("start server");
const fs = require('fs');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const {body, validationResult, query} = require('express-validator');
const bodyParser = require('body-parser');

const FeedbackMessage = require('./models/feedback-message');
const User = require('./models/user');
const {response} = require("express");
const feedbackMessagesFileName = 'data/feedback-messages.data';
const usersFileName = 'data/users.data';

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
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

app.get('/quotes', (request, response) => {
    response.render('quotes');
});

app.get('/registration', (request, response) => {
    response.render('registration');
});

app.get('/shop', (request, response) => {
    response.render('shop');
});

app.get('/random-colors', (request, response) => {
    let colors = getColors();
    let randomIndexColor = Math.floor(Math.random() * colors.length);
    response.json(colors[randomIndexColor]);
})

const minPasswordLength = 6;
app.post('/registration',
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
            message: 'User registration successful',
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



app.get('/name', (request, response) => {
    response.json({name: request.query.first + " " + request.query.last})
});

app.use('/json', (req, response) => {
    response.send(req.method + " " + req.path + " - " + req.ip);
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

function getColors() {
    return [
        {
            id: 1,
            value: '#16a085'
        },

        {
            id: 2,
            value: '#27ae60'
        },

        {
            id: 3,
            value: '#2c3e50'
        },

        {
            id: 4,
            value: '#f39c12'
        },

        {
            id: 5,
            value: '#e74c3c'
        },

        {
            id: 6,
            value: '#9b59b6'
        },

        {
            id: 7,
            value: '#FB6964'
        },

        {
            id: 8,
            value: '#342224'
        },

        {
            id: 9,
            value: '#472E32'
        },

        {
            id: 10,
            value: '#BDBB99'
        },

        {
            id: 11,
            value: '#77B1A9'
        },

        {
            id: 12,
            value: '#73A857'
        }
    ];
}


console.log("go to http://localhost:3002");
app.listen(3002);
