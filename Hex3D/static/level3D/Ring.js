// Hex3D game - AllyModel class
// ring around the ally (addition to allyModel)
// author: Michał Skałka

class Ring extends THREE.Mesh {
    constructor() {
        super() 
        let radius = Settings.a
        this.geometry = new THREE.RingGeometry((radius / 100) * 20, (radius / 100) * 30, 6);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0 });
        this.rotation.x = Math.PI / 2
        console.log(this)
    }
}
