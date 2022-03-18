// Hex3D game - Level3D class
// building level map 
// author: Michał Skałka

class Level3D {

    constructor(scene) {
        this.gameStarted = false
        this.scene = scene
        this.levelChoosed = false
        this.positionOfPlayer = {}
        this.bulbLightsArray = []
        this.lightsArr = []
        this.getData();
        this.floors = []
        this.allies = []
        this.rings = []
        this.clickable = []
        this.loadingComplete = false
    }

    // getting all saves from server and thean creating menu for user
    getData() {
        console.log("X");
        $.ajax({
            url: "/",
            data: { action: "load" },
            type: "POST",
            success: function (data) {
                var obj = JSON.parse(data)
                console.log(obj);
                $("#right").empty()
                $("#menu").empty()
                $("#menu").text("Choose save:")
                for (let i = 0; i < obj.loaded.length; i++) {
                    let div = document.createElement("div")
                    div.innerHTML = obj.loaded[i].name
                    div.dataset.id = i
                    div.className = "menuItem"
                    let menu = document.getElementById("menu")
                    menu.appendChild(div)
                }
                $("#menu").css("display", "flex")
                $(".menuItem").on("click", function () {
                    $("#menu").css("display", "none")
                    $("#menu").empty()
                    $("#loading_text").text("loading...")
                    console.log(JSON.parse(obj.loaded[this.dataset['id']].lvl));
                    level3d.makeLevel(JSON.parse(obj.loaded[this.dataset['id']].lvl))
                })
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    /*  Creating level, by usin level code (from save)
        Firstly, it's generating array of positions for every room from save.
    */
    makeLevel(level) {
        console.log(level);
        let size = level.size
        let radius = Settings.a 
        let wallsize = (2 * radius) / Math.sqrt(3)

        let width = 0
        for (let i = 0; i < size; i++) {
            if (i % 2 == 0) {
                width += 2 * wallsize;
            }
            else
                width += wallsize;
        }
        console.log(width);

        let positions = {}
        let down = 0
        let nDown = radius
        let left = 0
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (j == 0)
                    positions[`${i}${j}`] = { z: ((width / 2) - radius) * (-1), x: ((width / 2) - radius) - down }
                else if (j % 2 != 0) {
                    positions[`${i}${j}`] = { z: (((width / 2) - radius) * (-1)) + left, x: ((width / 2) - radius) - nDown }
                }
                else {
                    positions[`${i}${j}`] = { z: (((width / 2) - radius) * (-1)) + left, x: ((width / 2) - radius) - (nDown - radius) }
                }
                left += (3 / 2) * wallsize
            }
            left = 0
            down += (2 * radius)
            nDown += (2 * radius)
        }
        console.log(positions);
        // this.positionOfPlayer = positions[`00`]

        let lastDirIn = ""

        // simple plain to check if mouse click outside the generated level
        var geometry = new THREE.PlaneGeometry(10000, 10000, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geometry, material);
        plane.position.y -= 2
        plane.rotation.x = Math.PI / 2
        plane.name = "outside"
        this.clickable.push(plane)
        this.scene.add(plane);
        console.log(level);

        /*  Creating 3D level using Hex3D class (hexagonal rooms)/
            Position of every room is declared in "position" array.
            It checks type of every room and if it different form "wall" it puts suitable element to it (ally/light or treasure).
        */
        for (let i = 0; i < level.level.length; i++) {
            if (i == 0) { // creating hexagonal room with player
                var cel1 = new Hex3D(level.level[i].dirIn, level.level[i].dirOut, true)
                this.positionOfPlayer = positions[`${level.level[i].z}${level.level[i].x}`]
            }
            else { // creating other hexagonal rooms
                var cel1 = new Hex3D(level.level[i - 1].dirIn, level.level[i].dirOut)
            }
            cel1.name = "hex_block"
            this.scene.add(cel1)
            // room positioning
            cel1.position.x = positions[`${level.level[i].z}${level.level[i].x}`].x
            cel1.position.z = positions[`${level.level[i].z}${level.level[i].x}`].z
            cel1.position.y = (radius / 5) + 10

            // checking type of room and adding treasuer box/ ally or lighty
            if (level.level[i].type == "treasure") {
                let treasure = new Treasure()
                treasure.name = "treasure"
                treasure.position.x = positions[`${level.level[i].z}${level.level[i].x}`].x
                treasure.position.z = positions[`${level.level[i].z}${level.level[i].x}`].z
                treasure.position.y = radius * (1 / 8)
                this.scene.add(treasure)
            }
            else if (level.level[i].type == "light") {
                let light = new Light()
                light.name = "light"
                this.bulbLightsArray.push(light)
                light.position.x = positions[`${level.level[i].z}${level.level[i].x}`].x
                light.position.z = positions[`${level.level[i].z}${level.level[i].x}`].z
                light.position.y = radius / 2
                this.scene.add(light)
                // console.log(this.lightsArray);
            }
            else if (level.level[i].type == "ally") {
                let allyModel = new AllyModel(this.allies.length)
                allyModel.loadModel("../model/Hunter/tris.js", (allydata) => {
                    console.log("model jest załadowany")
                    this.scene.add(allyModel)
                })
                allyModel.name = "ally"
                allyModel.isSelected = false
                allyModel.setAnimation("stand")

                allyModel.position.x = positions[`${level.level[i].z}${level.level[i].x}`].x
                allyModel.position.z = positions[`${level.level[i].z}${level.level[i].x}`].z
                allyModel.position.y = (Settings.a / 5) + 25
                this.allies.push(allyModel)
                this.clickable.push(allyModel)
                console.log(this.allies);
                // console.log(this.lightsArray);
            }
        }
        this.levelChoosed = true
    }
}