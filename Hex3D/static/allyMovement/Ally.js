class AllyTest extends THREE.Object3D {

    constructor() {
        super()
        //
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(60, 16, 16),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: true
            })
        );
        this.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu

        this.add(this.mesh)
        this.add(this.axes)
    }

}