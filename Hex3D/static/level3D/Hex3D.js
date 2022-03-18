// Hex3D game - Hex3D class
// generates hexagonal room with entry and exit
// author: Michał Skałka

class Hex3D {
    constructor(doors1, doors2) {
        let radius = Settings.a  // variable size of the hexagon, and thus of the entire maze
        let wallsize = (2 * radius) / Math.sqrt(3)
        console.log(radius);
        let container = new THREE.Object3D() // container for 3D objects

        // cuboid wall 
        let geometry = new THREE.BoxGeometry(wallsize, radius, 20);
        let material = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            specular: 0xaaaaaa,
            shininess: 0,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("mats/wall.jpg"),
        });
        let wall = new THREE.Mesh(geometry, material); // cuboid - hexagonal room wall
        for (let i = 0; i < 6; i++) {
            if (i != doors1 && i != doors2) { // making room walls
                let side = wall.clone()
                side.castShadow = true  // wall clone
                side.receiveShadow = true
                side.name = "walls"
                side.position.x = Math.cos(i * 60 * (Math.PI / 180)) * radius  // point on the circle to calculate
                side.position.z = Math.sin(i * 60 * (Math.PI / 180)) * radius  // point on the circle to calculate     
                side.lookAt(container.position)    // directing the wall towards the center of the 3D container
                container.add(side)                // addinf wall to container
            }
            else if (i == doors1 || i == doors2) { // making holes for doors
                let side = doors3d.door(i)
                side.castShadow = true
                side.receiveShadow = true
                side.name = "walls"
                side.position.x = Math.cos(i * 60 * (Math.PI / 180)) * radius  // point on the circle to calculate 
                side.position.z = Math.sin(i * 60 * (Math.PI / 180)) * radius
                side.lookAt(container.position)
                container.add(side)
            }

        }

        // room floor
        geometry = new THREE.CylinderGeometry(wallsize, wallsize, 20, 6);
        material = new THREE.MeshPhongMaterial({
            color: 0x888888,
            specular: 0x888888,
            shininess: 1,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("mats/floor.jpg"),
        });
        let cylinder = new THREE.Mesh(geometry, material);
        cylinder.receiveShadow = true
        cylinder.position.y -= (1 / 5) * wallsize
        cylinder.name = "floor"
        level3d.floors.push(cylinder)
        level3d.clickable.push(cylinder)
        console.log(level3d.floors);
        container.add(cylinder)

        return container
    }
}