// author: Michał Skałka
console.log("wczytano plik Game.js")

class Game {
    constructor() {
        this.szachownica = []
        this.positions = []
        this.scene
        this.camera
        this.renderer
        this.pawn
        this.pawns = new THREE.Object3D();
        this.areas = []
        this.isPawnSelected = false
        this.xkill = false
        this.ykill = false
        this.createMap()
        this.render()
    }

    createMap = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maksymalna renderowana odległość od kamery
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x282828);
        this.renderer.setSize($(window).width(), $(window).height());

        $("#root").append(this.renderer.domElement);

        this.camera.position.set(0, 500, 500)
        this.camera.lookAt(this.scene.position);

        var axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)
        var color = 0
        var material
        var brownAreasArray = []
        for (var i = -4; i < 4; i++) {
            var tab = []
            var pos = []
            for (var j = 4; j > -4; j--) {
                tab.push(0)
                var geometry = new THREE.BoxGeometry(40, 20, 40);
                material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load(`mats/${(color % 2 == 0) ? "white" : "brown"}.png`),
                })
                var cube = new THREE.Mesh(geometry, material);
                cube.type = "map"
                cube.X = (i * 40) + 20;
                cube.Z = (j * 40) - 20;
                cube.szachownicaY = i + 4
                cube.szachownicaX = Math.abs(j - 4)
                cube.position.set((i * 40) + 20, 0, (j * 40) - 20)
                var obj = { x: (i * 40) + 20, z: (j * 40) - 20, color: (color % 2 == 0) ? "white" : "brown" }
                cube.colorOfArea = (color % 2 == 0) ? "white" : "brown"
                pos.push(obj)
                if (cube.colorOfArea == "brown")
                    this.areas.push(cube)
                this.scene.add(cube);
                color++
            }
            color++
            this.szachownica.push(tab)
            this.positions.push(pos)
        }
        // console.log(this.areas);
        this.render();
    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
    }

    setCamera = (color) => {
        if (color == "white") {
            this.camera.position.set(0, 300, 400)
            this.camera.lookAt(this.scene.position);
        }
        else {
            this.camera.position.set(0, 300, -400)
            this.camera.lookAt(this.scene.position);
        }
    }

    checkArea = () => {

    }

    addCyliders = () => {
        this.pawnGeometry = new THREE.CylinderGeometry(17, 17, 15, 32);
        this.pawnMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(`mats/vwhite.png`),
        })

        var licznik = 0
        for (let i = 0; i < this.positions.length; i++) {
            for (let j = 0; j < 2; j++) {
                if (this.positions[i][j].color == "brown") {
                    const cylinder = new Pionek(this.positions[i][j].x, this.positions[i][j].z, "white")
                    cylinder.szachownicaY = i
                    cylinder.szachownicaX = j
                    cylinder.name = `w${licznik}`
                    this.pawns.add(cylinder)
                    this.szachownica[i][j] = "1"
                    licznik++
                }
            }
        }

        this.pawnMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(`mats/orange.png`),
        })
        licznik = 0
        for (let i = 0; i < this.positions.length; i++) {
            for (let j = 6; j < 8; j++) {
                if (this.positions[i][j].color == "brown") {
                    const cylinder = new Pionek(this.positions[i][j].x, this.positions[i][j].z, "orange")
                    cylinder.szachownicaY = i
                    cylinder.szachownicaX = j
                    cylinder.name = `o${licznik}`
                    this.pawns.add(cylinder)
                    this.szachownica[i][j] = "2"
                    licznik++
                }
            }
        }
        this.rayCaster()
    }

    rayCaster = () => {
        var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
        var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
        $(document).mousedown((event) => {
            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);
            var intersects = raycaster.intersectObjects(this.pawns.children);
            var map_intersects = raycaster.intersectObjects(this.scene.children);
            // console.log(map_intersects[0]);
            if (net.turn == net.playerColor) {
                if (intersects.length > 0 && this.isPawnSelected == false && net.playerColor == intersects[0].object.team && net.gameStatus == "playing") {
                    // console.log(intersects[0]);
                    this.isPawnSelected = ""
                    this.isPawnSelected = intersects[0]
                    intersects[0].object.select = "W";
                    this.lightUpArea(this.isPawnSelected.object.szachownicaX, this.isPawnSelected.object.szachownicaY, this.isPawnSelected.object.team, "select")
                }
                else if (typeof (this.isPawnSelected) == "object" && map_intersects.length > 0 && net.gameStatus == "playing" && map_intersects[0].object.colorOfArea == "brown") {
                    if ((this.isPawnSelected.object.team == "white" && this.szachownica[map_intersects[0].object.szachownicaY][map_intersects[0].object.szachownicaX] != "1" && map_intersects[0].object.canMove == true) || (this.isPawnSelected.object.team == "orange" && this.szachownica[map_intersects[0].object.szachownicaY][map_intersects[0].object.szachownicaX] != "2" && map_intersects[0].object.canMove == true)) {
                        var nameToDelete = ""
                        // console.log(map_intersects[0]);
                        if (map_intersects[0].object.areaToAtack == true) {
                            nameToDelete = game.getName(map_intersects[0].object.toKill_X, map_intersects[0].object.toKill_Y)
                            game.deleteByName(nameToDelete)
                            this.xkill = map_intersects[0].object.toKill_X
                            this.ykill = map_intersects[0].object.toKill_Y
                            this.lightUpArea(this.isPawnSelected.object.szachownicaX, this.isPawnSelected.object.szachownicaY, this.isPawnSelected.object.team, "unselect")
                            this.szachownica[this.ykill][this.xkill] = 0
                            this.xkill = false
                            this.ykill = false
                        }
                        else {
                            nameToDelete = false
                            this.lightUpArea(this.isPawnSelected.object.szachownicaX, this.isPawnSelected.object.szachownicaY, this.isPawnSelected.object.team, "unselect")
                        }
                        this.szachownica[this.isPawnSelected.object.szachownicaY][this.isPawnSelected.object.szachownicaX] = 0
                        let pawnToMove = { X_from: this.isPawnSelected.object.szachownicaX, Y_from: this.isPawnSelected.object.szachownicaY, X_to: map_intersects[0].object.szachownicaX, Y_to: map_intersects[0].object.szachownicaY, X_map: map_intersects[0].object.X, Z_map: map_intersects[0].object.Z }
                        this.isPawnSelected.object.szachownicaX = map_intersects[0].object.szachownicaX
                        this.isPawnSelected.object.szachownicaY = map_intersects[0].object.szachownicaY
                        this.szachownica[this.isPawnSelected.object.szachownicaY][this.isPawnSelected.object.szachownicaX] = (this.isPawnSelected.object.team == "white") ? "1" : "2"
                        this.isPawnSelected.object.unselect = "X";
                        this.isPawnSelected.object.position.set(map_intersects[0].object.X, 10, map_intersects[0].object.Z)

                        net.arrayUpdate("turn", JSON.stringify(pawnToMove), nameToDelete)
                        this.isPawnSelected = false
                    }
                    else if (map_intersects[0].object.szachownicaX == this.isPawnSelected.object.szachownicaX && map_intersects[0].object.szachownicaY == this.isPawnSelected.object.szachownicaY) {
                        this.lightUpArea(this.isPawnSelected.object.szachownicaX, this.isPawnSelected.object.szachownicaY, this.isPawnSelected.object.team, "unselect")
                        this.isPawnSelected.object.unselect = "X";
                        this.isPawnSelected = false
                    }
                    console.log(this.szachownica);
                }
            }
        })
        this.scene.add(this.pawns);
        console.log(this.szachownica);
    }

    movePawn = (pawn) => {
        for (let i = 0; i < this.pawns.children.length; i++) {
            if (this.pawns.children[i].szachownicaX == pawn.X_from && this.pawns.children[i].szachownicaY == pawn.Y_from) {
                this.pawns.children[i].szachownicaX = pawn.X_to
                this.pawns.children[i].szachownicaY = pawn.Y_to
                this.pawns.children[i].position.set(pawn.X_map, 10, pawn.Z_map)
            }
        }
    }

    getName = (x, y) => {
        for (let i = 0; i < this.pawns.children.length; i++) {
            if (this.pawns.children[i].szachownicaX == x && this.pawns.children[i].szachownicaY == y) {
                // console.log(this.pawns.children[i].name);
                return this.pawns.children[i].name
            }
        }
    }

    deleteByName = (name) => {
        var objectToDelete = this.pawns.getObjectByName(name)
        this.scene.remove(objectToDelete)
        this.pawns.remove(objectToDelete)
        // console.log("DELETED!");
    }

    lightUpArea = (x, y, team, type) => {
        if (team == "white") {
            if (x + 1 <= 7 && y + 1 <= 7 && this.szachownica[y + 1][x + 1] == 0) {
                game.findArea(x + 1, y + 1, type)
            }
            else if (x + 1 <= 7 && y + 1 <= 7 && x + 2 <= 7 && y + 2 <= 7 && this.szachownica[y + 1][x + 1] == 2 && this.szachownica[y + 2][x + 2] == 0) {
                game.findArea(x + 2, y + 2, type, "areaToAtack", x + 1, y + 1)
            }

            if (x + 1 <= 7 && y - 1 >= 0 && this.szachownica[y - 1][x + 1] == 0) {
                game.findArea(x + 1, y - 1, type)
            }
            else if (x + 1 <= 7 && y - 1 >= 0 && x + 2 <= 7 && y - 2 >= 0 && this.szachownica[y - 1][x + 1] == 2 && this.szachownica[y - 2][x + 2] == 0) {
                game.findArea(x + 2, y - 2, type, "areaToAtack", x + 1, y - 1)
            }
        }
        else {
            if (x - 1 >= 0 && y - 1 >= 0 && this.szachownica[y - 1][x - 1] == 0) {
                game.findArea(x - 1, y - 1, type)
            }
            else if (x - 1 >= 0 && y - 1 >= 0 && x - 2 >= 0 && y - 2 >= 0 && this.szachownica[y - 1][x - 1] == 1 && this.szachownica[y - 2][x - 2] == 0) {
                game.findArea(x - 2, y - 2, type, "areaToAtack", x - 1, y - 1)
            }

            if (x - 1 >= 0 && y + 1 <= 7 && this.szachownica[y + 1][x - 1] == 0) {
                game.findArea(x - 1, y + 1, type)
            }
            else if (x - 1 >= 0 && y + 1 <= 7 && x - 2 >= 0 && y + 2 <= 7 && this.szachownica[y + 1][x - 1] == 1 && this.szachownica[y + 2][x - 2] == 0) {
                game.findArea(x - 2, y + 2, type, "areaToAtack", x - 1, y + 1)
            }
        }
    }

    findArea = (x, y, type, canAtack, kill_X, kill_Y) => {
        for (let i = 0; i < this.areas.length; i++) {
            if (this.areas[i].szachownicaX == x && this.areas[i].szachownicaY == y) {
                if (type == "select") {
                    this.areas[i].canMove = true
                    this.areas[i].material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load(`mats/purple.png`),
                    })
                    if (canAtack == "areaToAtack") {
                        this.areas[i].toKill_X = kill_X
                        this.areas[i].toKill_Y = kill_Y
                        this.areas[i].areaToAtack = true
                    }
                }
                else {
                    this.areas[i].canMove = false
                    this.areas[i].material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load(`mats/brown.png`),
                    })
                    if (canAtack == "areaToAtack") {
                        this.areas[i].toKill_X = false
                        this.areas[i].toKill_Y = false
                        this.areas[i].areaToAtack = false
                    }
                }
            }
        }
    }
}