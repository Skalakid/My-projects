var hex3d;
var doors3d;
var settings;
var pionek;
$(document).ready(function () {
    // hex3d = new Hex3D()
    doors3d = new Doors3D()

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );
    console.log(camera.rotation.z);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF);
    renderer.setSize($(window).width(), $(window).height());

    $("#root").append(renderer.domElement);

    camera.position.set(-1, Settings.a + 800, 0)
    camera.lookAt(scene.position = 0.1);

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    var size = 10000;
    var divisions = 100;

    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    });

    var cel1 = new Hex3D(3, 2)
    console.log(cel1);
    scene.add(cel1)


    function render() {
        requestAnimationFrame(render);
        console.log("render leci")
        renderer.render(scene, camera);
    }

    render();
})