class Model {
    constructor() {
        this.container = new THREE.Object3D()
        this.mixer = null
        this.player
        this.axes
        this.clock
        this.animationPlaying = ""
    }

    loadModel = (url, callback) => {
        console.log(this.container);
        var modelMaterial = new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load("../model/Alien/alien.png"), // dowolny plik png, jpg
                morphTargets: true // ta własność odpowiada za możliwość animowania materiału modelu
            });

        var loader = new THREE.JSONLoader();
        let radius = Settings.a
        loader.load(url, (geometry) => {
            // ładowanie modelu jak poprzednio
            var meshModel = new THREE.Mesh(geometry, modelMaterial)
            meshModel.name = "name";
            meshModel.castShadow = true           // klon ściany
            meshModel.receiveShadow = true
            meshModel.rotation.y = 0; // ustaw obrót modelu
            meshModel.position.y = 0; // ustaw pozycje modelu
            meshModel.scale.set(radius / 100, radius / 100, radius / 100); // ustaw skalę modelu

            //utworzenie mixera jak poprzednio
            this.mixer = new THREE.AnimationMixer(meshModel)

            //dodanie modelu do kontenera (na poprzednich zajęciach był to testowy sześcian)
            this.player = meshModel
            this.container.add(meshModel)

            this.light = new THREE.PointLight(0xffffee, 0.5);
            this.light.shadow.bias = -0.02
            this.light.distance = 600
            this.light.decay = 5
            this.light.castShadow = false
            level3d.lightsArr.push(this.light)
            this.container.add(this.light)

            this.axes = new THREE.AxesHelper(70)
            this.axes.visible = false
            this.axes.rotation.y = (Math.PI / 2) * (-1)
            this.container.add(this.axes)

            // zwrócenie kontenera
            this.clock = new THREE.Clock();
            console.log(geometry.animations)
            this.mixer.timeScale = 1
            this.setAnimation("stand")
            this.animationPlaying = "start"

            callback(this.container);

        });
    }
    getPlayerCont() {
        return this.container
    }
    getPlayerMesh() {
        return this.player
    }

    getPlayerAxes() {
        return this.axes
    }

    // update mixera

    updateModel() {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta)
    }

    //animowanie postaci

    setAnimation(name) {
        this.animationPlaying = name
        this.mixer.clipAction(name).play();
    }

    stopAnimation(name) {
        this.mixer.clipAction(name).stop();
    }

}