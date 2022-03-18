import { Ball } from "./Ball"
import { wall } from "./Decorators";

interface position {
    y: number;
    x: number;
}


interface game {
    width: number;
    numberOfBalls: number;
    balls: Array<any>
}

class Game implements game {
    width: number;
    numberOfBalls: number;
    private map_A: (number | string)[][] = []
    private map_B: (number | string | object)[][][] = []
    private map_Balls: Ball[][] = []
    public balls: Ball[] = []
    public balls_Preview: Ball[] = []
    private selectedBall: HTMLDivElement
    start: position = { y: null, x: null };
    end: position = { y: null, x: null };
    noClickEnd: position = { y: null, x: null };
    path: Array<string> = []
    number: number = 1;
    isPathFinded: boolean = false
    cursorOnArea: string = ""
    counter: number = 0
    beforeStart: Ball
    points: number = 0
    public wall: HTMLDivElement


    constructor(width: number, X: number) { // --- creting map arrays ---
        console.log("MAP")
        this.width = width
        this.numberOfBalls = X
        this.map_createMaps()
        this.wall = document.createElement("div")
        this.wall.id = "wall"
        this.wall.style.display = "none"
        document.body.appendChild(this.wall)
        console.log(this.wall)
        document.body.onkeydown = (event) => {
            console.log(this.balls)
            console.log(this.map_Balls)
        }
    }

    map_createMaps() { // --- creating map_A and map_B ---
        for (let i = 0; i < this.width; i++) {
            let row_A: (number | string)[] = []
            let row_B: (number | string | object)[][] = []
            let row_Balls: Ball[] = []
            for (let j = 0; j < this.width; j++) {
                let area: Array<any> = []
                row_A.push(0)
                row_Balls.push(null)
                row_B.push(area)
            }
            this.map_A.push(row_A)
            this.map_B.push(row_B)
            this.map_Balls.push(row_Balls)
        }
        console.log(this.map_A)
        console.log(this.map_B)
        console.log(this.map_Balls)
        this.map_setRandomBalls(this.numberOfBalls)
        this.map_createDivs()
    }

    map_createDivs() { // --- create div map ---
        let divMap: HTMLDivElement = document.createElement("div")
        divMap.className = "map"
        for (let i = 0; i < this.width; i++) {
            let row: HTMLDivElement = document.createElement("div")
            row.className = "row"
            for (let j = 0; j < this.width; j++) {
                let area: HTMLDivElement = document.createElement("div")
                area.className = "area"
                area.id = `${i}_${j}`
                area.onmouseenter = (event) => {
                    let element = event.target as HTMLDivElement
                    this.cursorOnArea = element.id
                    if (this.start.y != null && this.end.y == null) {
                        this.map_noClicked_clear()
                        let x: number = Number(element.id.split("_")[1])
                        let y: number = Number(element.id.split("_")[0])
                        if (element.innerText == "" && element.children.length == 0) {
                            // element.innerText = "M"
                            this.map_A[y][x] = "M"
                            this.noClickEnd.y = y
                            this.noClickEnd.x = x
                            this.findPath([this.start], [[`${this.start.y}_${this.start.x}`]], 1)
                        }
                    }
                }
                area.onclick = (event) => {
                    if (this.end.y == null) {
                        let element = event.target as HTMLDivElement
                        var parentElement = element.parentElement
                        let x: number
                        let y: number
                        if (parentElement.className == "row") {
                            x = Number(element.id.split("_")[1])
                            y = Number(element.id.split("_")[0])
                        }
                        else {
                            x = Number(parentElement.id.split("_")[1])
                            y = Number(parentElement.id.split("_")[0])
                        }
                        console.log(this.start)
                        console.log(y + " " + x)

                        if (element.className == "ball" && this.start.y == null) {
                            console.log("START")
                            this.isPathFinded = false
                            element.style.width = "40px"
                            element.style.height = "40px"
                            this.selectedBall = element
                            console.log(this.selectedBall)
                            this.beforeStart = this.map_Balls[y][x]
                            this.map_Balls[y][x] = null
                            this.map_A[y][x] = "S"
                            this.path.push(element.parentElement.id)
                            this.start.y = y
                            this.start.x = x
                            this.map_B[y][x].push(this.start)
                        }
                        else if (element.className != "ball" && element.children.length == 0 && this.start.y != null && this.end.y == null && this.path.length > 0) {
                            console.log("END")
                            // element.innerText = "M"
                            this.noClickEnd = { y: null, x: null };
                            this.map_A[y][x] = "M"
                            this.end.y = y
                            this.end.x = x
                            this.selectedBall.style.removeProperty("width")
                            this.selectedBall.style.removeProperty("height")
                            // this.findPath([this.start], [[`${this.start.y}_${this.start.x}`]], 1)
                            for (let i = 0; i < this.path.length; i++) {
                                var area = document.getElementById(this.path[i])
                                area.style.background = "#dddddd`"
                            }
                            var end = document.getElementById(`${this.end.y}_${this.end.x}`)
                            end.appendChild(this.selectedBall)
                            for (let i = 0; i < this.balls.length; i++) {
                                if (this.balls[i].id == Number(this.selectedBall.id)) {
                                    this.map_A[y][x] = "B"
                                    this.map_Balls[y][x] = this.beforeStart
                                    this.balls[i].changeYX(this.end.y, this.end.x)
                                    console.log(this.balls[i])
                                    break
                                }
                            }

                            setTimeout(() => {
                                this.map_clear()
                                console.log("ADD 3 BALLS")
                                console.log(this.map_A)
                                this.check(this.beforeStart, "click")
                                console.log(this.map_Balls)
                                this.map_makeArrayRight()
                                this.selectedBall = null
                                this.beforeStart = null
                                this.end.y = null
                                this.end.x = null
                            }, 1000);

                        }
                        else if (this.start.y == y && this.start.x == x) {
                            this.isPathFinded = true
                            this.selectedBall.style.removeProperty("width")
                            this.selectedBall.style.removeProperty("height")
                            this.map_A[y][x] = "B"
                            this.map_Balls[y][x] = this.beforeStart
                            this.beforeStart = null
                            this.selectedBall = null
                            this.path = []
                            this.start.y = null
                            this.start.x = null
                            this.map_B[y][x] = []
                        }
                    }
                }
                row.appendChild(area)
            }
            divMap.appendChild(row)
        }
        document.body.appendChild(divMap)
        this.map_putBalls()
        console.log("map div - completed")
    }


    map_makeArrayRight() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                let child = document.getElementById(`${i}_${j}`).children
                if (child.length > 0) {
                    for (let k = 0; k < this.balls.length; k++) {
                        if (String(this.balls[k].id) == child[0].id) {
                            this.map_A[i][j] = "B"
                            this.map_Balls[i][j] = this.balls[k]
                            console.log(this.balls[k])
                        }
                    }
                }
            }
        }
    }

    map_setRandomBalls(nr: number) {
        for (let i = 0; i < 3; i++) {
            let ball = new Ball(this.counter, 0, 0)
            this.balls_Preview.push(ball)
            document.getElementById("preview").appendChild(ball.div)
            this.counter++
        }

        console.log(this.balls_Preview)
        console.log("random Xes - completed")
    }

    @wall
    gameOver() {
        setTimeout(function () {
            if (confirm("Czy chcesz zagrać jeszcze raz?")) {
                location.reload();
            }
        }, 500)
    }

    map_putBalls() {
        let c: number = 0
        while (c < 3) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.width; j++) {
                    let rand: number = Math.floor(Math.random() * 20);
                    if (this.map_A[i][j] == 0 && rand == 5 && c < 3) {
                        if (document.getElementById(`${i}_${j}`).children.length == 0)
                            if (this.balls.length < (this.width * this.width)) {
                                document.getElementById("preview").removeChild(this.balls_Preview[c].div)
                                var area: HTMLElement = document.getElementById(`${i}_${j}`)
                                area.appendChild(this.balls_Preview[c].div)
                                this.balls_Preview[c].y = i
                                this.balls_Preview[c].x = j
                                this.map_A[i][j] = "B"
                                this.map_Balls[i][j] = this.balls_Preview[c]
                                this.balls.push(this.balls_Preview[c])
                                this.check(this.balls_Preview[c], "auto")
                                // console.log(this.balls_Preview[c].div)
                                c++
                            }
                            else {
                                break;
                            }
                    }
                }
                if (this.balls.length >= (this.width * this.width)) {
                    c = 4
                    break
                }
            }
        }

        if (this.balls.length >= (this.width * this.width)) {
            this.gameOver()
        }

        this.balls_Preview = []
        this.map_setRandomBalls(3)
    }

    map_noClicked_clear() {
        for (let i = 0; i < this.path.length; i++) {
            var element = document.getElementById(this.path[i])
            element.style.background = "white"
            if (element.innerText == "M" && element.children.length == 0)
                element.innerText = ""
        }
        this.path = []
        this.isPathFinded = false
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.map_A[i][j] != "B") {
                    this.map_A[i][j] = 0
                    this.map_B[i][j] = []
                }
            }
        }
    }

    map_clear() {
        for (let i = 0; i < this.path.length; i++) {
            var element = document.getElementById(this.path[i])
            element.style.background = "white"
            if (element.children.length == 0)
                element.innerText = ""
        }
        this.start = { y: null, x: null }
        this.end = { y: null, x: null }
        this.path = []
        this.isPathFinded = false
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.map_A[i][j] != "B") {
                    this.map_A[i][j] = 0
                    this.map_B[i][j] = []
                }
            }
        }
    }

    horizontallyArray: Ball[]

    check(currentBall: Ball, state: string) {
        console.log("HORIZONTALLLLLLLLY")
        //  --- Horizontally ---
        let x: number = currentBall.x
        let ballsHorizontally: Ball[] = []
        while (x + 1 < this.width && this.map_Balls[currentBall.y][x + 1] != null && currentBall.color == this.map_Balls[currentBall.y][x + 1].color) {
            ballsHorizontally.push(this.map_Balls[currentBall.y][x + 1])
            x++
        }
        x = currentBall.x
        while (x - 1 >= 0 && this.map_Balls[currentBall.y][x - 1] != null && currentBall.color == this.map_Balls[currentBall.y][x - 1].color) {
            ballsHorizontally.push(this.map_Balls[currentBall.y][x - 1])
            x--
        }

        //  --- Perpendicularly ---
        let ballsPerpendicularly: Ball[] = []
        let y: number = currentBall.y
        while (y + 1 < this.width && this.map_Balls[y + 1][currentBall.x] != null && currentBall.color == this.map_Balls[y + 1][currentBall.x].color) {
            ballsPerpendicularly.push(this.map_Balls[y + 1][currentBall.x])
            y++
        }
        y = currentBall.y
        while (y - 1 >= 0 && this.map_Balls[y - 1][currentBall.x] != null && currentBall.color == this.map_Balls[y - 1][currentBall.x].color) {
            ballsPerpendicularly.push(this.map_Balls[y - 1][currentBall.x])
            y--
        }

        // --- DiagonallyRight ---
        let ballsDiagonallyRight: Ball[] = []
        x = currentBall.x
        y = currentBall.y
        while (x + 1 < this.width && y + 1 < this.width && this.map_Balls[y + 1][x + 1] != null && currentBall.color == this.map_Balls[y + 1][x + 1].color) {
            ballsDiagonallyRight.push(this.map_Balls[y + 1][x + 1])
            x++
            y++
        }
        x = currentBall.x
        y = currentBall.y
        while (x - 1 >= 0 && y - 1 >= 0 && this.map_Balls[y - 1][x - 1] != null && currentBall.color == this.map_Balls[y - 1][x - 1].color) {
            ballsDiagonallyRight.push(this.map_Balls[y - 1][x - 1])
            x--
            y--
        }

        // --- DiagonallyLeft ---
        let ballsDiagonallyLeft: Ball[] = []
        x = currentBall.x
        y = currentBall.y
        while (x + 1 < this.width && y - 1 >= 0 && this.map_Balls[y - 1][x + 1] != null && currentBall.color == this.map_Balls[y - 1][x + 1].color) {
            ballsDiagonallyLeft.push(this.map_Balls[y - 1][x + 1])
            x++
            y--
        }
        x = currentBall.x
        y = currentBall.y
        while (x - 1 >= 0 && y + 1 < this.width && this.map_Balls[y + 1][x - 1] != null && currentBall.color == this.map_Balls[y + 1][x - 1].color) {
            ballsDiagonallyLeft.push(this.map_Balls[y + 1][x - 1])
            x--
            y++
        }

        console.log(ballsHorizontally)
        console.log(ballsPerpendicularly)
        console.log(ballsDiagonallyRight)
        console.log(ballsDiagonallyLeft)

        let fullArray: Ball[] = []
        if (ballsHorizontally.length >= 4)
            fullArray = fullArray.concat(ballsHorizontally)

        if (ballsPerpendicularly.length >= 4)
            fullArray = fullArray.concat(ballsPerpendicularly)

        if (ballsDiagonallyRight.length >= 4)
            fullArray = fullArray.concat(ballsDiagonallyRight)

        if (ballsDiagonallyLeft.length >= 4)
            fullArray = fullArray.concat(ballsDiagonallyLeft)

        if (fullArray.length > 0) {
            fullArray.push(currentBall)
            console.log(fullArray)
            this.deleteBalls(fullArray)
        }
        else if (state == "click") {
            this.map_putBalls()
        }
    }


    deleteBalls(fiveBalls: Array<any>) {
        let counter: number = 0
        console.log("USUWAŃSKO")
        for (let i = 0; i < fiveBalls.length; i++) {
            this.map_A[fiveBalls[i].y][fiveBalls[i].x] = 0
            this.map_Balls[fiveBalls[i].y][fiveBalls[i].x] = null
            document.getElementById(`${fiveBalls[i].id}`).remove()
        }
        this.ballsCheck()
        let bonus: number = 0
        for (let i = 1; i < fiveBalls.length - 4; i++) {
            bonus += 100 * i
        }
        this.points += 500 + bonus
        document.getElementById("points").innerText = `Points: ${this.points}`
    }

    ballsCheck() {
        var array: Ball[] = []
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.width; j++) {
                if (document.getElementById(`${i}_${j}`).children.length > 0) {
                    let id: number = Number(document.getElementById(`${i}_${j}`).children[0].id)
                    for (let o = 0; o < this.balls.length; o++) {
                        if (this.balls[o].id == id) {
                            array.push(this.balls[o])
                        }
                    }
                }
            }
        }

        this.balls = array
        console.log(this.balls)
    }


    findPath(nearAreas: { y: number, x: number }[], path: string[][], nr: number) { // --- "recurency" ---
        if (this.isPathFinded == false) {
            let newAreas: { y: number, x: number }[] = []
            let paths: string[][] = []
            for (let i = 0; i < nearAreas.length; i++) {
                let x = nearAreas[i].x
                let y = nearAreas[i].y
                // console.log(nr)
                // console.log(`${nr}: ${this.map_A[y][x]} ${nearAreas.length}`)
                if (this.map_A[y][x] == "M") {
                    console.log("PATH FINDED!")
                    this.path = path[i]
                    this.showPath()
                    this.isPathFinded = true
                    break
                }
                else {
                    if (x + 1 <= this.width && this.map_A[y][x + 1] != "B" && (this.map_A[y][x + 1] == 0 || this.map_A[y][x + 1] == "M")) {
                        if (this.map_A[y][x + 1] != "M")
                            this.map_A[y][x + 1] = nr
                        var obj: position = { y: y, x: (x + 1) }
                        newAreas.push(obj)

                        var pathNow: Array<string> = [...path[i]]
                        pathNow.push(`${y}_${x + 1}`)
                        paths.push(pathNow)

                        this.map_B[y][x + 1] = pathNow
                    }

                    if (y - 1 >= 0 && this.map_A[y - 1][x] != "B" && (this.map_A[y - 1][x] == 0 || this.map_A[y - 1][x] == "M")) {
                        if (this.map_A[y - 1][x] != "M")
                            this.map_A[y - 1][x] = nr
                        var obj: position = { y: (y - 1), x: x }
                        newAreas.push(obj)

                        var pathNow: Array<string> = [...path[i]]
                        pathNow.push(`${y - 1}_${x}`)
                        paths.push(pathNow)

                        this.map_B[y - 1][x] = pathNow
                    }

                    if (y + 1 < this.width && this.map_A[y + 1][x] != "B" && (this.map_A[y + 1][x] == 0 || this.map_A[y + 1][x] == "M")) {
                        if (this.map_A[y + 1][x] != "M")
                            this.map_A[y + 1][x] = nr
                        var obj: position = { y: (y + 1), x: x }
                        newAreas.push(obj)
                        var pathNow: Array<string> = [...path[i]]
                        pathNow.push(`${y + 1}_${x}`)
                        paths.push(pathNow)

                        this.map_B[y + 1][x] = pathNow
                    }

                    if (x - 1 >= 0 && this.map_A[y][x - 1] != "B" && (this.map_A[y][x - 1] == 0 || this.map_A[y][x - 1] == "M")) {
                        if (this.map_A[y][x - 1] != "M")
                            this.map_A[y][x - 1] = nr
                        var obj: position = { y: y, x: (x - 1) }
                        newAreas.push(obj)

                        var pathNow: Array<string> = [...path[i]]
                        pathNow.push(`${y}_${x - 1}`)
                        paths.push(pathNow)

                        this.map_B[y][x - 1] = pathNow
                    }
                }
            }
            if (newAreas.length > 0)
                this.findPath(newAreas, paths, nr + 1)
            else {
                return 0
            }
        }
    }

    showPath() {

        for (let i = 0; i < this.path.length; i++) {
            var element = document.getElementById(this.path[i])
            element.style.background = "#bbbbbb"
        }

        if (this.end.y != null) {

            setTimeout(() => {
                this.map_clear()
            }, 1000);
        }
        // console.log(this.path)
    }
}

export { Game };
