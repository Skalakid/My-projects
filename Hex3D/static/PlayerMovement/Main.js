$(document).ready(function () {
    var scene = new THREE.Scene();


    var camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF);
    renderer.setSize($(window).width(), $(window).height());

    $("#root").append(renderer.domElement);

    camera.position.set(0, 1000, 1000)
    camera.lookAt(scene.position);

    //----

    var size = 1000;
    var divisions = 10;
    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    var geometry = new THREE.PlaneGeometry(1000, 1000, 1000);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffaa, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.position.y -= 4
    scene.add(plane);

    let player = new Player()
    let cube = player.getPlayerCont()
    console.log(cube);
    cube.position.y = 54
    scene.add(cube);

    var geometry = new THREE.SphereGeometry(20, 16, 16);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
    });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "sphere"
    scene.add(sphere);

    // --- raycaster ---
    var clickedVect = new THREE.Vector3(0, 0, 0);  //punkt
    var directionVect = new THREE.Vector3(0, 0, 0);  //kierunek

    var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
    var way = 0
    var i = 0
    $(document).mousedown(function (event) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        console.log(intersects.length)
        if (intersects.length > 0) {
            clickedVect = intersects[0].point
            // console.log(clickedVect)
            directionVect = clickedVect.clone().sub(player.getPlayerCont().position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
            // console.log(directionVect)
            console.log(player.getPlayerCont().position.clone().distanceTo(clickedVect))
            var angle = Math.atan2(
                player.getPlayerCont().position.clone().x - clickedVect.x,
                player.getPlayerCont().position.clone().z - clickedVect.z
            )
            player.getPlayerMesh().rotation.y = angle
            player.getPlayerAxes().rotation.y = angle + Math.PI
            way = player.getPlayerCont().position.clone().distanceTo(clickedVect)


            //użyta wyżej funkcja normalize() przelicza proporcjonalnie współrzędne x,y,z wektora na zakres 0-1
            //jest to wymagane przez kolejne funkcje
            sphere.position.set(clickedVect.x, 0, clickedVect.z)
            i = 0
        }

    })

    function render() {
        if (i < way) {
            player.getPlayerCont().translateOnAxis(directionVect, 5) // 5 - przewidywany speed czyli względna szybkość ruchu po planszy
            player.getPlayerCont().position.y = 54
            i += 5
        }
        camera.position.x = player.getPlayerCont().position.x
        camera.position.z = player.getPlayerCont().position.z + 500
        camera.position.y = player.getPlayerCont().position.y + 500
        camera.lookAt(player.getPlayerCont().position)


        requestAnimationFrame(render);

        console.log("render leci")

        renderer.render(scene, camera);
    }

    render();
})