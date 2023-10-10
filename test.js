class Request {
    #method;
    #path;
    #data;

    constructor(requestString) {
        let paths = requestString.split(" ");
        this.#method = paths[0];
        this.#path = paths[1];
        this.#data = JSON.parse(paths.splice(2).join(" "));
    }

    getMethod() {
        return this.#method;
    }

    getPath() {
        return this.#path;
    }

    getData() {
        return this.#data;
    }

}

class Response {
    #code = 201;

    send(txt) {
        this.responseString = "Headers: content-type: text, body: " + txt;
        this.setCode(200)
    }
    json(obj) {
        this.responseString = "Headers: content-type: application/json, body: " + JSON.stringify(obj);
        this.setCode(200)
    }

    setCode(code) {
        this.#code = code;
    }

    getFinalResponseString() {
        return this.#code + ": " + this.responseString;
    }
}

class App {
    #routes = [];

    use(path, callback) {
        this.#routes[path] = callback;
    }

    run(requestString) {
        let req = new Request(requestString);
        let resp = new Response();

        if (this.#routes.hasOwnProperty(req.getPath())) {
            this.#routes[req.getPath()](req, resp);
        } else {
            resp.setCode(404);
            resp.send('Route ' + req.getPath() + ' not found');
        }

        console.log(resp.getFinalResponseString());
    }
}

let app = new App();

app.use('/users', (req, resp)=>{
    resp.send('USERS with data!!! Name:' + req.getData().userName);
})

app.use('/users2', (req, resp)=>{
    resp.json({
        id: 1,
        lastName: 123,
    });
})

app.run('POST /users {"userName": "Mike "}');
app.run('POST /users2 {}');

let colors = [
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
