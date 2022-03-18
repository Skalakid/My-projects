// Hex3D server
// author: Michał Skałka

let http = require("http");
let fs = require("fs");
let qs = require("querystring")
let formidable = require("formidable")
let path = require("path")

// declaration of the nedb datastore
let Datastore = require('nedb')
let dataStorage = new Datastore({
    filename: 'baza.db',
    autoload: true
});

// checks the file extension and returns its MIME type
function getMIMEtype(file) {
    switch (path.extname(file)) {
        case ".js":
            return 'application/javascript'
            break;
        case ".css":
            return 'text/css'
            break;
        case ".jpg":
            return 'image/jpg'
            break;
        case ".png":
            return 'image/png'
            break;
        case ".mp3":
            return 'audio/mp3'
            break;
        case ".gif":
            return 'image/gif'
            break;
    }
}

// creating server
// handling page switching and loading assets
var server = http.createServer(function (req, res) {
    console.log(decodeURI(req.url))
    switch (req.method) {
        case "GET":
            if (req.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/hex") {
                fs.readFile("static/hex.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/game") {
                fs.readFile("static/game.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/movement") {
                fs.readFile("static/player.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/ally") {
                fs.readFile("static/ally.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/allies") {
                fs.readFile("static/allies.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/allymodel") {
                fs.readFile("static/allymodel.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (decodeURI(req.url).indexOf("/icons/") == 0) {
                fs.readFile(`static${decodeURI(req.url)}`, function (error, data) {
                    let file = `static${decodeURI(req.url)}`
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    res.write(data);
                    res.end();
                })
            }
            else if (decodeURI(req.url) != "/favicon.ico") {
                fs.readFile(`static${decodeURI(req.url)}`, function (error, data) {
                    let file = `static${decodeURI(req.url)}`
                    res.writeHead(200, { 'Content-Type': getMIMEtype(file) });
                    res.write(data);
                    res.end();
                })
            }
            else if (decodeURI(req.url) == "/favicon.ico") {
                fs.readFile(`static/favicon.ico`, function (error, data) {
                    let file = `static/favicon.ico`
                    res.writeHead(200, { 'Content-Type': 'image/ico' });
                    res.write(data);
                    res.end();
                })
            }
            break;
        case "POST":
            servResponse(req, res)
            break;
    }
})

server.listen(3000, function () {
    console.log("Starting server on port 3000...")
});

// handles server responding
function servResponse(req, res) {
    let allData = "";

    // when we get POST data (as packets), it links them, in sequence, to one variable "allData".
    req.on("data", function (data) {
        console.log("data: " + data)
        allData += data;
    })

    // when server gets all data, it parse them to the "finish" object. Than it sends it to the browser.
    req.on("end", function (data) {
        let finish = qs.parse(allData)
        // handles "save" action. Inserts data to data store.
        if (finish.action == "save") {
            let element = { name: finish.name, lvl: finish.lvl }
            dataStorage.insert(element, function (err, newDoc) {
                console.log("object saved")
                res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
                res.end(JSON.stringify(finish, null, 4));
            });
        }
        // handles "load" action. Simply sends back whole data store with levels.
        else if (finish.action == "load") {
            dataStorage.find({}, function (err, docs) {
                finish.loaded = docs;
                res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
                res.end(JSON.stringify(finish, null, 4));
            });
        }


    })
}