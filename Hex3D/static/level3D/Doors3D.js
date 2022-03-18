// Hex3D game - Door3D class (hex3D subclass)
// creates 3D wall with door
// author: Michał Skałka

class Doors3D {
    constructor() {

    }

    door() {
        var radius = Settings.a 
        var wallsize = (2 * radius) / Math.sqrt(3)
        var container = new THREE.Object3D() 

        // creating wall object
        var geometry = new THREE.BoxGeometry(wallsize / 3, radius, 20);
        var material = new THREE.MeshPhongMaterial({
            color: 0x888888,
            specular: 0x888888,
            shininess: 0,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("mats/wall.jpg"),
        });
        var wall = new THREE.Mesh(geometry, material); 

        // creating the wall with the door (hole)
        var door_wall1 = wall.clone()
        door_wall1.position.x -= (wallsize / 6) * 2
        door_wall1.castShadow = true
        door_wall1.receiveShadow = true
        container.add(door_wall1)

        var door_wall2 = wall.clone()
        door_wall2.position.x += (wallsize / 6) * 2
        door_wall2.castShadow = true
        door_wall2.receiveShadow = true
        container.add(door_wall2)

        return container
    }

}