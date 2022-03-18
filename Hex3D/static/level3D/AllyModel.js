// Hex3D game - AllyModel class
// generates an ally (addition to a room)
// author: Michał Skałka

class AllyModel extends THREE.Object3D {

    constructor(id) {
        super()
        this.mesh = null
        this.mixer = null
        this.clock = new THREE.Clock();
        this._id = id
        this.animationPlaying
        this.isRing = false
    }

    // generating model of an ally
    loadModel(url, callback) {

        let that = this
        let radius = Settings.a

        var modelMaterial = new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load("../model/Hunter/Hunter.png"), 
                morphTargets: true // animation of model
            });

        let loader = new THREE.JSONLoader();

        loader.load(url, function (geometry) {
            // helping axes
            that.mesh = new THREE.Mesh(geometry, modelMaterial) 
            that.axes = new THREE.AxesHelper(70)
            that.axes.visible = false
            that.axes.rotation.y = 3 * Math.PI / 2

            // ring around an ally
            that.ring = new Ring()
            that.ring.position.y -= (radius / 100) * 20
            level3d.rings.push(that.ring)

            // green light from ally
            that.light = new THREE.PointLight(0x22ff22, 0.5);
            that.light.shadow.bias = -0.02
            that.light.distance = 800
            that.light.decay = 7
            that.light.castShadow = false
            level3d.lightsArr.push(that.light)

            that.mesh.name = `allyModel${that._id}`
            that.mesh._id = that._id
            that.mesh.castShadow = true
            that.mesh.receiveShadow = true
            that.mesh.rotation.y = 0
            that.mesh.scale.set(radius / 100, radius / 100, radius / 100)

            that.mixer = new THREE.AnimationMixer(that.mesh);

            that.mixer.clipAction("stand").play();
            that.mixer.timeScale = 1 // animation speed

            that.add(that.mesh)
            that.add(that.axes)
            that.add(that.ring)
            that.add(that.light)

            callback(that);
        });
    }

    // updates the model animation
    updateModel() {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta)
    }

    // changes the model animation
    setAnimation(animationName) {
        if (this.mixer) {
            this.animationPlaying = animationName
            this.mixer.uncacheRoot(this.mesh)
            this.mixer.clipAction(animationName).play();
        }
    }
}