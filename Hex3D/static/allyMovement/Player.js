class Player {

    constructor() {

        this.container = new THREE.Object3D()

        var geometry = new THREE.BoxGeometry(100, 100, 100, 2, 2, 2);
        var material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
        });
        this.player = new THREE.Mesh(geometry, material); // player sześcian
        this.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0
        });
        this.behindPlayer = new THREE.Mesh(geometry, material); // player sześcian
        this.behindPlayer.position.z = -50

        this.container.add(this.player) // kontener w którym jest player
        this.container.add(this.axes)
        this.container.add(this.behindPlayer)
    }



    //funkcja zwracająca cały kontener

    getPlayerCont() {
        return this.container
    }

    //funkcja zwracająca playera czyli sam sześcian

    getPlayerMesh() {
        return this.player
    }

    getPlayerAxes() {
        return this.axes
    }

    getBehindPlayerMesh() {
        return this.behindPlayer
    }
}