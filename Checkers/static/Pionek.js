// author: Michał Skałka
class Pionek extends THREE.Mesh {
    constructor(x, z, color) {
        super(
            game.pawnGeometry.clone(),
            game.pawnMaterial.clone()
        ) // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        // console.log(this)

        this.position.set(x, 10, z);
        this.type = "pawn"
        this.team = color
    }

    set select(val) {
        // console.log("setter")
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(`mats/selected.png`),
        })
    }

    set unselect(val) {
        // console.log("setter")

        if (this.team == "white") {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load(`mats/vwhite.png`),
            })
        } else {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load(`mats/orange.png`),
            })
        }
    }

    get kolor() {
        // console.log("getter")
        return this._color
    }
}