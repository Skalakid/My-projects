// author: Michał Skałka

var http = require("http");
var fs = require("fs");
var qs = require("querystring")
var formidable = require("formidable")
var path = require("path")
let userArray = []
let checkersArray = []
let trun = "white"
let pawnToMove = ""
let pawnToDelete = false

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
    }
}

var server = http.createServer(function (req, res) {
    console.log(decodeURI(req.url))
    switch (req.method) {
        case "GET":
            if (req.url == "/admin") {
                fs.readFile("static/admin.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
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
            servResponse(req, res);
            break;
    }
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});

function servResponse(req, res) {
    var allData = "";

    //kiedy przychodzą dane POSTEM, w postaci pakietów,
    //łącza się po kolei do jednej zmiennej "allData"
    // w poniższej funkcji nic nie modyfikujemy

    req.on("data", function (data) {
        // console.log("data: " + data)
        allData += data;
    })

    //kiedy przyjdą już wszystkie dane
    //parsujemy je do obiektu "finish"
    //i odsyłamy do przeglądarki

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        switch (finish.action) {
            case "ADD_USER":
                if (userArray.length < 2) {
                    let isThisUserAdded = false
                    for (let i = 0; i < userArray.length; i++) {
                        if (userArray[i] == finish.user) {
                            isThisUserAdded = true
                        }
                    }
                    if (isThisUserAdded == false) {
                        userArray.push(finish.user)
                        finish.response = "USER_ADDED"
                        if (userArray.length == 1) {
                            finish.playerColor = "white"
                        }
                        else {
                            finish.playerColor = "orange"
                        }
                    }
                    else {
                        finish.response = "USER_EXIST"
                    }
                }
                else {
                    finish.response = "TOO_MANY_USERS"
                }
                break;
            case "CLEAR_MAP":
                finish.response = "USERS_CLEARED"
                userArray = []
                break;
            case "IS_SECOND_PLAYER":
                finish.userArray = userArray
                break;
            case "ARRAY_UPDATE":
                checkersArray = JSON.parse(finish.array)
                console.log(checkersArray);
                if (finish.type == "turn") {
                    pawnToMove = JSON.parse(finish.pawnToMove)
                    pawnToDelete = finish.toDelete
                    if (trun == "white")
                        turn = "orange"
                    else
                        turn = "white"
                    break;
                }
            case "ARRAY_CHECK":
                if (JSON.stringify(checkersArray) === finish.oldArray) {
                    finish.newArray = false
                }
                else {
                    finish.newArray = checkersArray
                    finish.pawnToMove = pawnToMove

                    if (pawnToDelete != false)
                        finish.toDelete = pawnToDelete
                    else
                        finish.toDelete = false
                }

                break;
        }
        res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
        res.end(JSON.stringify(finish, null, 4));
    })
}