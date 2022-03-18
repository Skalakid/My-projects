class Doors3D {
    constructor() {

    }

    door(index) {
        var radius = Settings.a // zmienna wielkość hexagona, a tym samym całego labiryntu
        var wallsize = (2 * radius) / Math.sqrt(3)

        var container = new THREE.Object3D() // kontener na obiekty 3D

        var geometry = new THREE.BoxGeometry(wallsize / 3, radius, 20);
        var material = new THREE.MeshNormalMaterial({
        });
        var wall = new THREE.Mesh(geometry, material); // prostopadłościan - ściana hex-a

        var door_wall1 = wall.clone()
        door_wall1.position.x -= (wallsize / 6) * 2
        container.add(door_wall1)

        var door_wall2 = wall.clone()
        door_wall2.position.x += (wallsize / 6) * 2
        container.add(door_wall2)

        return container
    }

}