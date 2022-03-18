// author: Michał Skałka

class Hex {
    constructor() {
        this.level = {}
        this.builtMap()
    }

    builtMap = (loaded) => {
        let left = 20 // initial LEFT posotional value
        let top = 20 // initial TOP posotional value
        let helper = 0 // this variable makes hexagons in one line alternately up and down to fit their sides.
        let id = 0 // id of hexagons
        let currentType = "walls" // current type of object to place

        // handles selecing type of objects to place (wall/ally/treasuer/light)
        $("#walls").addClass("selected")

        $("#walls").on("click", () => {
            currentType = "walls"
            document.getElementsByClassName("selected")[0].classList.remove("selected")
            $("#walls").addClass("selected")
        })
        $("#ally").on("click", () => {
            currentType = "ally"
            document.getElementsByClassName("selected")[0].classList.remove("selected")
            $("#ally").addClass("selected")
        })
        $("#light").on("click", () => {
            currentType = "light"
            document.getElementsByClassName("selected")[0].classList.remove("selected")
            $("#light").addClass("selected")
        })
        $("#treasure").on("click", () => {
            currentType = "treasure"
            document.getElementsByClassName("selected")[0].classList.remove("selected")
            $("#treasure").addClass("selected")
        })

        
        this.level.size = 3 // value of #select1 - size of the level
        if (loaded)
            this.level.size = loaded.size
        else
            this.level.size = $("#sel1").val()

       // building map of hexes by placing them in correct co-ordinates (depends from variables: left & top)
        for (let i = 0; i < this.level.size; i++) {
            for (let j = 0; j < this.level.size; j++) {
                if (helper == 1) {
                    top += 50
                }
                let block = $("<div>").addClass("hexagon").attr("data-z", i).attr("data-x", j).css("left", `${left}px`).css("top", `${top}px`).attr("id", id)
                id++
                $("#hex-panel").append(block)
                if (helper == 1) {
                    top -= 50
                    helper = 0
                } else if (helper == 0) {
                    helper = 1
                }
                left += 87
            }
            helper = 0
            top += 100
            left = 20
        }

        let lvl = [] // store the code of saved/loaded level
        if (loaded) {
            console.log(loaded.level);
            lvl = loaded.level
        }
        this.level.level = lvl
        let numberOfHex = 0 // stores number of clicked hexagon

        // handle hexagon click operations
        $(".hexagon").on("click", function () {
            console.log(lvl);
            let dir = 0 /* direction of an arrow from 0 to 5. The arrow points given side (the top one is 0, bottom one is 3)
                    0
                  _____
                 /     \
              5 /       \ 1
               (         ) 
              4 \       / 2     
                 \_____/
                    3
            */
            let dirIn = 3 //  entrance to a haxagonal room. Default value is 3 because when direcion = 0 entrance is on the botom side of hexagon.

            // if hexagon wasn't clicked set its value, add it to level code, than show an arrow and the direction number (0-5).
            if ($(this).is(':empty')) {
                this.dataset['_id'] = numberOfHex
                numberOfHex++;
                let div = document.createElement("div")
                div.className = "hex"
                div.innerHTML = dir
                this.appendChild(div)
            }
            else { // if hexagon was selected before, change the direction of an arrow and the entrance to the hexagonal room.
                dir = Number($(this).text()) + 1
                dirIn = dir + 3
                if (dirIn > 5) {
                    dirIn -= 6
                }
                if (dir > 5) dir = 0

                let obj = this.children[0]
                obj.style.transform = `rotate(${dir * 60}deg)`;
                $(this.children).text(`${dir}`)
            }

            /* create object that store all key informations to create level
                id - id of the hexagon
                dirOut - exit form the hexagon (direction of the arrow)
                dirIn - entrance to the hexagon (behind the pointing arrow)
                type - type of the object */
            let newobj = { id: this.id, x: this.dataset.x, z: this.dataset.z, dirOut: dir, dirIn: dirIn, type: currentType }

            // checking if the clicked hexzagon is already in level code 
            let isThere = false

            for (let i = 0; i < lvl.length; i++) {
                if (lvl[i].id == this.id) {
                    lvl.splice(i, 1, newobj)
                    isThere = true
                    break;
                }
            }
            if (isThere == false)
                lvl.push(newobj) // if not, add it to the level code
            isThere = false
            $("#console").text(JSON.stringify(lvl, null, 4)) // adding level code to the console panel

        })

        // loading level by checking code and creating suitable hexagons 
        if (loaded) {
            $("#console").text(JSON.stringify(this.level.level, null, 4))
            for (let i = 0; i < loaded.level.length; i++) {
                let element = document.getElementById(loaded.level[i].id)
                let div = document.createElement("div")
                div.className = "hex"
                div.innerHTML = loaded.level[i].dirOut
                element.appendChild(div)
                element.children[0].style.transform = `rotate(${loaded.level[i].dirOut * 60}deg)`;
            }
        }
    }

    // clears whole map
    clearMap() {
        $("#hex-panel").empty();
    }
    
}
