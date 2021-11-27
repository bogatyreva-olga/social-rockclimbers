// index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const feedbackMessagesFileName = 'feedback-messages.data';

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: require('./config/handlebars-helpers'),
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
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

app.get('/registration', (request, response) => {
    response.render('registration');
});

app.post('/registration', (request, response) => {
    console.log(request.body);
    response.json({message: "success registration"});
});

function getFeedbackMessages() {
    let data = [];
    if (!fs.existsSync(feedbackMessagesFileName)) {
        return data;
    }
    let fileData = fs.readFileSync(feedbackMessagesFileName);
    if (fileData) {
        data = JSON.parse(fileData);
    }
    return data;
}

function getNowTimestamp() {
    let ts = (new Date().getTime());
    return Math.round(ts / 1000);
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

app.get('/feedback', (request, response) => {
    response.render('feedback', {
        feedbackMessages: getFeedbackMessages(),
        categories: getFeedbackCategories(),
    });
});

app.post('/feedback/messages', (request, response) => {
    console.log(request.body);
    let data = getFeedbackMessages();
    let newFeedbackMessage = {
        nameUser: request.body.nameUser,
        feedbackMessage: request.body.feedbackMessage,
        categoryId: request.body.categoryId,
        createdAt: getNowTimestamp(),
    };
    data.push(newFeedbackMessage);

    fs.writeFileSync(feedbackMessagesFileName, JSON.stringify(data), () => {
    });

    response.json(newFeedbackMessage);
});

app.get('/feedback/messages', (request, response) => {
    response.json({
        feedbackMessages: getFeedbackMessages(),
    });
});

app.get('/feedback/categories', (request, response) => {
    response.json({
        categories: getFeedbackCategories(),
    });
});

app.listen(3001);