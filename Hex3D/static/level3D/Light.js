// Hex3D game - Item class
// generates light bulb (addition to a room)
// author: Michał Skałka

class Light {
    constructor() {
        var container = new THREE.Object3D() 
        var light = new THREE.PointLight(0xffffff, 0.5);
        light.shadow.bias = -0.02
        light.distance = 1000
        light.decay = 3
        light.castShadow = true
        level3d.lightsArr.push(light) // adds this light bulb to array in "level3d" class to be able to change their y position and power
        container.add(light)

        // creates small box as a light bulb
        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide,
            wireframe: true,
        });
        var bulb = new THREE.Mesh(geometry, material); 
        container.add(bulb)

        return container
    }

}