// Hex3D game - UI class
// chankgin properties of light bulbs
// author: Michał Skałka

class Ui {
    constructor(door1, door2) {
        $("#position").on("change", function () {
            level3d.bulbLightsArray.forEach(element => {
                element.position.y = $("#position").val()
            });
        })

        $("#intensity").on("change", function () {
            level3d.lightsArr.forEach(element => {
                element.intensity = $("#intensity").val()
            });
        })

        

    }
}