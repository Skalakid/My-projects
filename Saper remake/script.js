let minesInTab = 0
let tabValue = 0
let mapLeft = 0
let mapTop = 0
let mapX = ""
let mapY = ""
let rightClick = 1
let isMap = false
let mapToRemove
let gameOverAreaCheck = ""
let gameOver = false
let numberOfFlags = 0
let isAllBombsMarked = false
let d = new Date()
let cookieValue
let nickname = ""
let CookieTable
let gameName = ""
let gameNameCheck = true
let HStoRemove
let timeCookie

//document.cookie = `1/1/1=empty`
// 1. Wartości 
// --- Y ---
let yTimeOut
var diwY = document.createElement("div");
diwY.className = "pole"
var labelY = document.createElement("p");
labelY.innerHTML = "Height:"
labelY.style.cssFloat = "left"
labelY.style.fontSize = "20px"
labelY.style.margin = "15px 0 0 0"
var y = document.createElement("input");
y.className = "text"
y.onkeypress = function () {
    clearTimeout(yTimeOut)
    yTimeOut = setTimeout(function () {
        if (isNaN(y.value % 1) == true) {
            y.value = ""
            console.log(`Cleared "Height" input`);
        }
    }, 2000);

}

diwY.appendChild(labelY);
diwY.appendChild(y);
document.body.appendChild(diwY);
//-----------------------------------------//

// --- X ---
let xTimeOut
var diwX = document.createElement("div");
diwX.className = "pole"
var labelX = document.createElement("p");
labelX.innerHTML = "Width:"
labelX.style.cssFloat = "left"
labelX.style.fontSize = "20px"
labelX.style.margin = "15px 0 0 0"
var x = document.createElement("input");
x.className = "text"
x.onkeypress = function () {
    clearTimeout(xTimeOut)
    xTimeOut = setTimeout(function () {
        if (isNaN(x.value % 1) == true) {
            x.value = ""
            console.log(`Cleared "Width" input`);
        }
    }, 2000);
}

diwX.appendChild(labelX);
diwX.appendChild(x);
document.body.appendChild(diwX);
//-----------------------------------------//

// --- MINES ---
let minesTimeOut
var diwMines = document.createElement("div");
diwMines.className = "pole"
var labelMines = document.createElement("p");
labelMines.innerHTML = "Mines:"
labelMines.style.cssFloat = "left"
labelMines.style.fontSize = "20px"
labelMines.style.margin = "15px 0 0 0"
var mines = document.createElement("input");
mines.className = "text"
mines.onkeypress = function () {
    clearTimeout(minesTimeOut)
    minesTimeOut = setTimeout(function () {
        if (isNaN(mines.value % 1) == true) {
            mines.value = ""
            console.log(`Cleared "Mines" input`);
        }
    }, 2000);
}

diwMines.appendChild(labelMines);
diwMines.appendChild(mines);
document.body.appendChild(diwMines);

//-----------------------------------------//

// --- HighScore ---
CookieTable = document.cookie.split('; ')
console.log(CookieTable);
HS(CookieTable)

// 2. "Generuj" button
let generuj = document.createElement("button");
generuj.className = "generuj";
generuj.innerText = "Generuj"
let diw = document.createElement("div");
diw.className = "time"
let timer //setInterval
generuj.onclick = function () {
    // Checking the content of input values
    if (y.value == "" || x.value == "" || mines.value == "") {
        alert("Uzupełnij wszystkie pola!")
    }
    else {
        // --- Removing old map ---
        if (isMap == true) {
            mapToRemove = document.getElementById("map")
            console.log(mapToRemove);
            mapToRemove.remove()
            mapLeft = 0
            mapTop = 0
            gameOver = false
        }

        // --- Setting cookie
        CookieTable = document.cookie.split('; ')
        console.log(CookieTable);
        gameNameCheck = true
        gameName = `${y.value}/${x.value}/${mines.value}`
        for (let i = 0; i < CookieTable.length; i++) {
            gameNameCheck = true
            for (let j = 0; j < gameName.length; j++) {
                if (CookieTable[i][j] != gameName[j]) {
                    gameNameCheck = false
                }
            }
            if (gameNameCheck === true) {
                break;
            }
        }

        if (gameNameCheck === false) {
            console.log("Brak takiego cookie!");
            d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 2);
            timeCookie = d.toUTCString()
            document.cookie = `${y.value}/${x.value}/${mines.value}=empty;expires=${timeCookie}`
        }

        CookieTable = document.cookie.split(';')
        console.log(CookieTable);



        // --- Time ---
        let timerDiv = document.createElement("div")
        document.body.appendChild(timerDiv);
        seconds = 0;
        clearInterval(timer);
        diw.innerHTML = "Grasz: " + seconds + " [s]";
        document.body.appendChild(diw);
        seconds++
        timer = setInterval(function () {
            diw.innerHTML = "Grasz: " + seconds + " [s]";
            timerDiv.appendChild(diw);
            ++seconds
        }, 1000)

        // Creating empty table + map

        let gameTab = new Array(y.value)

        var map = document.createElement("div");
        isMap = true
        map.id = "map"
        map.style.width = x.value * 30 + "px"
        map.style.height = y.value * 30 + "px"

        // --- gameTab 
        for (var i = 0; i <= Number(y.value) + 1; i++) {
            gameTab[i] = new Array(x.value)
            for (var j = 0; j <= Number(x.value) + 1; j++) {
                if (i == 0 || i == Number(y.value) + 1) {
                    gameTab[i][j] = 5
                }
                else if (j == 0 || j == Number(x.value) + 1) {
                    gameTab[i][j] = 5
                }
                else {
                    gameTab[i][j] = 0
                }
            }
        }


        for (var i = 0; i < y.value; i++) {
            for (var j = 0; j < x.value; j++) {
                var mapArea = document.createElement("div")
                mapArea.id = `${i}${j}`
                mapArea.className = "mapArea"
                mapArea.dataset["leftclick"] = 1
                mapArea.style.left = mapLeft + "px"
                mapArea.style.top = mapTop + "px"
                mapArea.dataset["mapAreaLeft"] = mapLeft / 30
                mapArea.dataset["mapAreaTop"] = mapTop / 30

                mapArea.onclick = function () {
                    if (gameOver == false && this.dataset["leftclick"] != 2) {
                        mapX = this.style.left
                        mapY = this.style.top
                        mapX = (mapX.slice(0, mapX.length - 2) / 30) + 1
                        mapY = (mapY.slice(0, mapY.length - 2) / 30) + 1
                        // console.log(mapX)
                        // console.log(mapY)
                        if (gameTab[mapY][mapX] == 0) {
                            nearbyMines(gameTab, Number(mapY), Number(mapX))
                        }
                        else if (gameTab[mapY][mapX] == 1) { // --- GAME OVER
                            document.cookie = `${y.value}/${x.value}/${mines.value}` + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                            gameOver = true
                            this.style.backgroundImage = `url("./img/bomb.png")`
                            for (var i = 0; i < y.value; i++) {
                                for (var j = 0; j < x.value; j++) {

                                    if (gameTab[i + 1][j + 1] == 1) {
                                        gameOverAreaCheck = document.getElementById(`${i}${j}`)
                                        gameOverAreaCheck.style.backgroundImage = `url("./img/bomb.png")`
                                    }
                                }
                            }
                            clearInterval(timer);

                            setTimeout(function () {
                                alert("Game Over!")
                            }, 50)
                        }
                    }
                }
                // --- LEFT CLICK 3 options : flag / "?" / normal --- 
                mapArea.addEventListener("contextmenu", function (e) {
                    if (gameOver == false && this.dataset["leftclick"] != 3) {
                        if (this.dataset["leftclick"] == 1) { // --- Game Win!
                            this.style.backgroundImage = `url("./img/flaga.png")`
                            this.dataset["leftclick"] = 2

                            isAllBombsMarked = true
                            for (var i = 0; i < y.value; i++) {
                                for (var j = 0; j < x.value; j++) {
                                    gameOverAreaCheck = document.getElementById(`${i}${j}`)
                                    if (gameTab[i + 1][j + 1] == 1) {
                                        if (gameOverAreaCheck.dataset["leftclick"] != 2) {
                                            isAllBombsMarked = false
                                        }
                                    }
                                    if (gameOverAreaCheck.dataset["leftclick"] == 2) {
                                        ++numberOfFlags
                                    }
                                }
                            }
                            console.log(`${numberOfFlags} ${isAllBombsMarked}`);
                            if (numberOfFlags == mines.value && isAllBombsMarked == true) {
                                setTimeout(function () {
                                    alert("You win!")
                                    while (true) {
                                        nickname = prompt("Podaj nick: ")
                                        if (nickname == "") {
                                            continue
                                        }
                                        else {
                                            console.log(getCookie(`${y.value}/${x.value}/${mines.value}`))
                                            document.cookie = `${y.value}/${x.value}/${mines.value}=` + getCookie(`${y.value}/${x.value}/${mines.value}`) + `|${nickname},${seconds - 1};expires=${timeCookie}`
                                            break
                                        }
                                    }
                                    HStoRemove = document.getElementById("highscores")
                                    HStoRemove.remove()
                                    CookieTable = document.cookie.split('; ')
                                    HS(CookieTable)

                                }, 50)
                                clearInterval(timer);

                                //funckja getCookie pobiera value podanego cookie, dorób dodawanie wynikow do cookie trwałych!


                            }
                            numberOfFlags = 0
                        }
                        else if (this.dataset["leftclick"] == 2) {
                            this.style.backgroundImage = `url("./img/pyt.png")`
                            this.dataset["leftclick"] = 0
                        }
                        else {
                            this.style.backgroundImage = `url("./img/klepa.png")`
                            this.dataset["leftclick"] = 1
                        }

                        e.preventDefault()
                    }
                });

                map.appendChild(mapArea)
                mapLeft = mapLeft + 30
            }
            mapLeft = 0
            mapTop = mapTop + 30
        }

        document.body.appendChild(map);
        console.log(gameTab)

        // Giving "bombs" to empty table

        while (minesInTab != mines.value) {
            for (var i = 1; i < Number(y.value) + 1; i++) {
                for (var j = 1; j < Number(x.value) + 1; j++) {
                    tabValue = Math.round(Math.random() * 50)
                    if (minesInTab != mines.value) {
                        if (tabValue == 1 && gameTab[i][j] != 1) {
                            minesInTab++
                            gameTab[i][j] = 1
                        }
                    }
                }
            }
        }

        minesInTab = 0
        console.log(gameTab)


    }
}

// Wywyołanie elementów
document.body.appendChild(generuj);

// --- Area checking --

// y0x0 | y0x1 | y0x2
// y1x0 | CNTR | y1x1
// y2x0 | y2x1 | y2x2

function nearbyMines(gameTab, y, x) {
    let suma = 0
    gameTab[y][x] = "B"

    if (gameTab[y - 1][x - 1] === 1) {
        suma += 1;
    }

    if (gameTab[y - 1][x] === 0) {
        nearbyMines(gameTab, y - 1, x)
    }
    else if (gameTab[y - 1][x] === 1) {
        suma += 1;
    }

    if (gameTab[y - 1][x + 1] === 1) {
        suma += 1;
    }

    if (gameTab[y][x - 1] === 0) {
        nearbyMines(gameTab, y, x - 1)
    }
    else if (gameTab[y][x - 1] === 1) {
        suma += 1;
    }

    if (gameTab[y][x + 1] === 0) {
        nearbyMines(gameTab, y, x + 1)
    }
    else if (gameTab[y][x + 1] === 1) {
        suma += 1;
    }

    if (gameTab[y + 1][x - 1] === 1) {
        suma += 1;
    }

    if (gameTab[y + 1][x] === 0) {
        nearbyMines(gameTab, y + 1, x)
    }
    else if (gameTab[y + 1][x] === 1) {
        suma += 1;
    }

    if (gameTab[y + 1][x + 1] === 1) {
        suma += 1;
    }

    let AreaCheck = document.getElementById(`${y - 1}${x - 1}`)
    console.log(y);
    console.log(x);
    if (suma == 0) {
        AreaCheck.style.color = "blue"
    }
    else if (suma == 1) {
        AreaCheck.style.color = "green"
    }
    else if (suma > 1) {
        AreaCheck.style.color = "red"
    }

    AreaCheck.style.backgroundImage = `url("./img/klepa1.png")`
    AreaCheck.dataset["leftclick"] = 3
    AreaCheck.innerHTML = suma
    suma = 0

}

// --- Function: get cookie value ---

function getCookie(name) {
    let value = ""
    let helper = true
    let nameEQ = name + "="
    let toSearch = document.cookie.split('; ')
    for (let i = 0; i < toSearch.length; i++) {
        let c = toSearch[i]
        for (let j = 0; j < nameEQ.length; j++) {
            if (nameEQ[j] != c[j]) {
                helper = false
                continue;
            }
        }
        if (helper == true) {
            for (let x = nameEQ.length; x < c.length; x++) {
                if (c[x] == ";") {
                    break
                }
                value += c[x];
            }
            return value
        }

        helper = true
        value = ""
    }
}


function HS(CookieTable) {
    let diwhighScores = document.createElement("div");
    diwhighScores.id = "highscores"
    diwhighScores.style.width = "200px"
    diwhighScores.style.height = "350px"
    let diwhighScoresNav = document.createElement("div");
    diwhighScoresNav.className = "highscoresNav"
    diwhighScoresNav.style.height = "35px"
    diwhighScoresNav.innerHTML = "High scores"

    diwhighScores.appendChild(diwhighScoresNav);
    let diwhighScoresSel = document.createElement("select");
    diwhighScoresSel.className = "sel"
    diwhighScoresSel.style.width = "196px"
    CookieTable.sort()
    let text = ""
    if (CookieTable[0] == "") {
        let so1 = document.createElement("option");
        so1.value = "empty"
        so1.innerHTML = "empty"
        diwhighScoresSel.appendChild(so1);
        diwhighScores.appendChild(diwhighScoresSel);
        document.body.appendChild(diwhighScores);
    }
    else {
        for (let i = 0; i < CookieTable.length; i++) {
            let so1 = document.createElement("option");
            for (let j = 0; j < 10; j++) {
                if (CookieTable[i][j] == "=") {
                    break
                }
                text += CookieTable[i][j]
            }

            so1.value = text
            so1.innerHTML = text
            diwhighScoresSel.appendChild(so1);
            text = ""
        }
        let diwtop = document.createElement("div");
        diwtop.id = "top"

        diwhighScoresSel.onchange = function () {
            document.getElementById("top").innerHTML = ""
            top10(diwhighScoresSel.value, diwtop)
        }
        diwhighScores.appendChild(diwhighScoresSel);
        top10(diwhighScoresSel.value, diwtop)
        diwhighScores.appendChild(diwtop);
        document.body.appendChild(diwhighScores);
    }


}

function top10(name, diwhighScores) {
    let tab = getCookie(name)
    let smallTab
    tab = tab.split('|')
    tab = tab.slice(1)
    for (let i = 0; i < tab.length; i++) {
        smallTab = tab[i].split(',')
        smallTab[1] = Number(smallTab[1])
        tab[i] = smallTab
    }
    tab.sort(function (a, b) { return a[1] - b[1] });
    console.log(tab);

    for (let i = 0; (i < tab.length && i < 10); i++) {
        let topTen = document.createElement("div");
        topTen.className = "topTen"

        let topTenNr = document.createElement("div");
        topTenNr.className = "topTenNr"
        topTenNr.innerHTML = i + 1 + "."
        let topTenNick = document.createElement("div");
        topTenNick.className = "topTenNick"
        topTenNick.innerHTML = tab[i][0]
        let topTenTime = document.createElement("div");
        topTenTime.className = "topTenTime"
        topTenTime.innerHTML = changeTime(tab[i][1])
        topTen.appendChild(topTenNr)
        topTen.appendChild(topTenNick)
        topTen.appendChild(topTenTime)

        diwhighScores.appendChild(topTen)
    }
}

function changeTime(sec) {
    let seconds = 0
    let minutes = 0
    let time
    sec = Number(sec)
    if (sec >= 60) {
        minutes = Math.floor(sec / 60)
    }
    seconds = sec - (60 * minutes)
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    return `${minutes}:${seconds}`
}
