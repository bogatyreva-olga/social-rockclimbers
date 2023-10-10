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
