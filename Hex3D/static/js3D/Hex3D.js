class Hex3D {
    constructor(doors1, doors2) {
        var radius = Settings.a // zmienna wielkość hexagona, a tym samym całego labiryntu
        var wallsize = (2 * radius) / Math.sqrt(3)
        console.log(radius);
        var container = new THREE.Object3D() // kontener na obiekty 3D

        var geometry = new THREE.BoxGeometry(wallsize, radius, 20);
        var material = new THREE.MeshNormalMaterial({
            // color: 0x8888ff,
            // side: THREE.DoubleSide,
            // wireframe: false,
            // transparent: true,
            // opacity: 0.5
        });
        var wall = new THREE.Mesh(geometry, material); // prostopadłościan - ściana hex-a

        for (var i = 0; i < 6; i++) {
            if (i != doors1 && i != doors2) {
                var side = wall.clone()            // klon ściany
                side.position.x = Math.cos(i * 60 * (Math.PI / 180)) * radius                // punkt na okręgu, do obliczenia
                side.position.z = Math.sin(i * 60 * (Math.PI / 180)) * radius                 // punkt na okręgu, do obliczenia      
                side.lookAt(container.position)    // nakierowanie ściany na środek kontenera 3D  
                container.add(side)                // dodanie ściany do kontenera
            }
            else if (i == doors1 || i == doors2) {
                var side = doors3d.door(i)
                side.position.x = Math.cos(i * 60 * (Math.PI / 180)) * radius                // punkt na okręgu, do obliczenia
                side.position.z = Math.sin(i * 60 * (Math.PI / 180)) * radius
                side.lookAt(container.position)
                container.add(side)
            }

        }
        var geometry = new THREE.CylinderGeometry(wallsize, wallsize, 20, 6);
        var material = new THREE.MeshNormalMaterial({
        });
        var cylinder = new THREE.Mesh(geometry, material);
        container.add(cylinder)

        return container
    }
}