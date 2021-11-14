// index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const chatMessagesFileName = 'chat-messages.data';

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
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

function getChatMessages() {
    let fileData = fs.readFileSync(chatMessagesFileName);
    let data = [];
    if (fileData) {
        data = JSON.parse(fileData);
    }
    return data;
}

app.get('/chat', (request, response) => {
    response.render('chat', {
        chatMessages: getChatMessages(),
    });
});

app.post('/chat/messages', (request, response) => {
    console.log(request.body);
    let data = getChatMessages();
    data.push(request.body);
    fs.writeFileSync(chatMessagesFileName, JSON.stringify(data), () => {
    });
    response.json({message: "success save"});
});

app.get('/chat/messages', (request, response) => {
    response.json({
        chatMessages: getChatMessages(),
    });
});

app.listen(3001);