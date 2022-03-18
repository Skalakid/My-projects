// Hex3D game - Item class
// generates treasure (addition to a room)
// author: Michał Skałka

class Treasure {
    constructor() {

        var radius = Settings.a 
        var container = new THREE.Object3D() 
        // creates samll box (as a treasure)
        var geometry = new THREE.BoxGeometry(radius / 4, radius / 4, radius / 4);
        var material = new THREE.MeshPhongMaterial({
            color: 0x888888,
            specular: 0x888888,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("mats/chest.png"),
        });
        var wall = new THREE.Mesh(geometry, material); 

        var item = wall.clone()
        item.castShadow = true
        item.receiveShadow = true
        container.add(item)
        return container
    }

}