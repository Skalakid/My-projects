class AllyModel extends THREE.Object3D {

    constructor() {
        super()
        this.mesh = null
        this.mixer = null
        this.clock = new THREE.Clock();

    }

    loadModel(url, callback) {

        let that = this

        var modelMaterial = new THREE.MeshBasicMaterial(
            {
                color: 0x000000,
                wireframe: true,
                // side: THREE.DoubleSide,
                // map: new THREE.TextureLoader().load("../model/Hunter/Hunter.png"), // dowolny plik png, jpg
                morphTargets: true // ta własność odpowiada za możliwość animowania materiału modelu
            });

        let loader = new THREE.JSONLoader();

        loader.load(url, function (geometry) {

            that.mesh = new THREE.Mesh(geometry, modelMaterial) // w materiale morphTargets:true

            that.mesh.name = "allyModel"
            that.mesh.position.y += 25
            that.mesh.scale.set(3, 3, 3)
            that.mixer = new THREE.AnimationMixer(that.mesh);

            that.mixer.clipAction("stand").play();

            that.mixer.timeScale = 1 // szybkość wykonywania animacji, można ją dostosować do projektu
            //
            that.add(that.mesh)
            //
            callback(that);

        });
    }

    // funkcja aktualizująca animację modelu

    updateModel() {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta)
    }

    //funkcja do zmiany animacji

    setAnimation(animationName) {
        if (this.mixer) {
            this.mixer.uncacheRoot(this.mesh)
            this.mixer.clipAction(animationName).play();
        }
    }

}