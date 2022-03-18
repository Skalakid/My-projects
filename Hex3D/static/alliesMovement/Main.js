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
    let objectsToMove = []
    var size = 2000;
    var divisions = 20;
    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    var geometry = new THREE.PlaneGeometry(2000, 2000, 2000, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffaa, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.position.y -= 2
    scene.add(plane);

    let player = new Player()
    let cube = player.getPlayerCont()
    console.log(cube);
    cube.position.y = 54
    scene.add(cube);
    objectsToMove.push(player.getPlayerCont())

    var geometry = new THREE.SphereGeometry(5, 16, 16);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
    });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "sphere"
    scene.add(sphere);

    for (let j = 0; j < 8; j++) {
        var allyTest = new AllyTest()
        scene.add(allyTest)
        var min = Math.floor(Math.random() * 2) + 1
        if (min == 1) min = -1
        else min = 1
        var x = Math.floor(Math.random() * 900) * min
        min = Math.floor(Math.random() * 2) + 1
        if (min == 1) min = -1
        else min = 1
        var z = Math.floor(Math.random() * 900) * min
        console.log(`${x},${z}`);
        allyTest.position.set(x, 54, z)
        allyTest.name = "ally"
        allyTest.id = 0
        allyTest.isSelected = false
        console.log(allyTest);
    }


    // --- raycaster ---
    var clickedVect = new THREE.Vector3(0, 0, 0);  //punkt
    var directionVect = new THREE.Vector3(0, 0, 0);  //kierunek
    var allyclickedVect = new THREE.Vector3(0, 0, 0);  //punkt
    var allydirectionVect = new THREE.Vector3(0, 0, 0);  //kierunek

    var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
    var way = 0
    var i = 0
    var allyWay = 0
    var ai = 0
    var thisAlly
    var allyAdded = false
    $(document).mousedown(function (event) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        console.log(intersects);
        if (intersects.length > 0) {
            if (intersects[0].object.parent.name == "ally") {
                if (intersects[0].object.parent.isSelected == false) {
                    thisAlly = intersects[0].object.parent
                    objectsToMove.push(intersects[0].object.parent)
                    console.log(objectsToMove);
                    thisAlly.isSelected = true
                    allyclickedVect = objectsToMove[objectsToMove.length - 2].position
                    console.log(thisAlly.position);
                    allydirectionVect = allyclickedVect.clone().sub(thisAlly.position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
                    console.log(allydirectionVect);
                    var angle = Math.atan2(
                        thisAlly.position.clone().x - allyclickedVect.x,
                        thisAlly.position.clone().z - allyclickedVect.z
                    )
                    allyAdded = true
                    thisAlly.axes.rotation.y = angle + Math.PI
                    thisAlly.mesh.rotation.y = angle + Math.PI
                    allyWay = thisAlly.position.clone().distanceTo(allyclickedVect)
                    ai = 0
                }
                else {
                    for (let i = 0; i < objectsToMove.length; i++) {
                        if (objectsToMove[i].id == intersects[0].object.parent.id) {
                            intersects[0].object.parent.isSelected = false
                            objectsToMove.splice(i, 1)
                        }
                    }
                }
                console.log(objectsToMove);

            }
            else {
                clickedVect = intersects[0].point
                console.log(clickedVect)
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

                if (objectsToMove.length > 1) {
                    for (let i = 1; i < objectsToMove.length; i++) {
                        allyclickedVect = player.getPlayerCont().position
                        allydirectionVect = allyclickedVect.clone().sub(objectsToMove[i].position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
                        var angle = Math.atan2(
                            objectsToMove[i].position.clone().x - allyclickedVect.x,
                            objectsToMove[i].position.clone().z - allyclickedVect.z
                        )
                        objectsToMove[i].axes.rotation.y = angle + Math.PI
                        objectsToMove[i].mesh.rotation.y = angle + Math.PI
                        allyWay = objectsToMove[i].position.clone().distanceTo(allyclickedVect) - 100
                        console.log(allyWay);
                    }
                }

                //użyta wyżej funkcja normalize() przelicza proporcjonalnie współrzędne x,y,z wektora na zakres 0-1
                //jest to wymagane przez kolejne funkcje
                sphere.position.set(clickedVect.x, 0, clickedVect.z)
                i = 0
            }
        }
    })

    function render() {
        if (i < way) {
            player.getPlayerCont().translateOnAxis(directionVect, 5) // 5 - przewidywany speed czyli względna szybkość ruchu po planszy
            player.getPlayerCont().position.y = 54
            if (objectsToMove.length > 1) {
                for (let i = 1; i < objectsToMove.length; i++) {
                    allyclickedVect = objectsToMove[i - 1].position
                    allydirectionVect = allyclickedVect.clone().sub(objectsToMove[i].position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
                    allyWay = objectsToMove[i].position.clone().distanceTo(allyclickedVect)
                    var angle = Math.atan2(
                        objectsToMove[i].position.clone().x - allyclickedVect.x,
                        objectsToMove[i].position.clone().z - allyclickedVect.z
                    )
                    objectsToMove[i].axes.rotation.y = angle + Math.PI
                    objectsToMove[i].mesh.rotation.y = angle + Math.PI
                    if (allyWay > 120) {
                        objectsToMove[i].translateOnAxis(allydirectionVect, 5)
                        objectsToMove[i].position.y = 54
                    }
                }
            }
            i += 5

        }

        if (ai + 100 < allyWay && allyAdded == true) {
            console.log("AAAAA" + allyWay);
            thisAlly.translateOnAxis(allydirectionVect, 5) // 5 - przewidywany speed czyli względna szybkość ruchu po planszy
            thisAlly.position.y = 54
            ai += 5
        } else {
            if (allyAdded == true)
                allyAdded = false
        }
        camera.position.x = player.getPlayerCont().position.x
        camera.position.z = player.getPlayerCont().position.z + 800
        camera.position.y = player.getPlayerCont().position.y + 800
        camera.lookAt(player.getPlayerCont().position)


        requestAnimationFrame(render);

        console.log("render leci")

        renderer.render(scene, camera);
    }

    render();
})