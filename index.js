// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.render('home', {
        name: 'John'
    })
})
app.get('/users', (request, response) => {
    response.render('users', {
        // users: [
        //     {"id": 1, "name": "John"},
        //     {"id": 2, "name": "Mike"},
        //     {"id": 3, "name": "Olya"}
        // ]
    })
})

app.listen(3000)