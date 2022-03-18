// Hex3D game - main class
// author: Michał Skałka

let level3d;
let doors3d;
let settings;
let ui;
let model;
let isClick = false

$(document).ready(function () {
    ui = new Ui()
    doors3d = new Doors3D()

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
        45,    // FOV
        window.innerWidth / window.innerHeight,    // view proportions
        0.1,    // minimum rendered distance from the camera
        10000    // maximal rendered distance from the camera
    )

    let renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0x000000, 0)
    renderer.setSize($(window).width(), $(window).height())
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    $("#root").append(renderer.domElement);

    camera.position.set(-1, Settings.a + 800, 200)
    camera.lookAt(scene.position = 0.1);

    // var axes = new THREE.AxesHelper(1000)
    // scene.add(axes)

    var size = 10000;
    var divisions = 100;

    // var gridHelper = new THREE.GridHelper(size, divisions);
    // scene.add(gridHelper);

    // var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControl.addEventListener('change', function () {
    //     renderer.render(scene, camera)
    // });


    level3d = new Level3D(scene); // building 3D level
    // console.log(level3d.positionOfPlayer);
    let meters = 0 // destination traveled by player
    let way = 0 // distance from player to the destination
    let i = 0
    let allyWay = 0
    let ai = 0 // distance from an ally to player
    let thisAlly // clicked ally
    let allyAdded = false 
    let objectsToMove = []


    // RAYCASTER
    let clickedVect = new THREE.Vector3(0, 0, 0);  // point
    let directionVect = new THREE.Vector3(0, 0, 0);  // direction
    let allyclickedVect = new THREE.Vector3(0, 0, 0);  // point
    let allydirectionVect = new THREE.Vector3(0, 0, 0);  // direction

    let raycaster = new THREE.Raycaster(); // an object simulating the "throwing" of rays
    let mouseVector = new THREE.Vector2() // this vector, i.s. the position in 2D space on the screen (x, y), will be used to determine the position of the mouse on the screen and then convert it to 3D positions
    let allyWithRing = null


    // Creating new player and handling raycaster movement of player and allies
    let newPlayer = () => {
        model = new Model()
        model.loadModel("../model/Alien/tris.js", function (modeldata) {
            console.log("the model has been loaded", modeldata)
            modeldata.position.set(level3d.positionOfPlayer.x, (Settings.a / 5) + 25, level3d.positionOfPlayer.z)
            modeldata.name = "player"
            level3d.gameStarted = true
            scene.add(modeldata) //object from Model.js
        })
        objectsToMove.push(model)

        // Visable point of click (small red sphere)
        let geometry = new THREE.SphereGeometry((Settings.a / 30), 16, 16);
        let material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
        });
        let sphere = new THREE.Mesh(geometry, material);
        sphere.name = "sphere"
        scene.add(sphere);
        let intersects
        meters = 0
        
        // adding new ally and handling their movement
        $(document).mousedown(function (event) {
            if (level3d.loadingComplete == true && intersects.length > 0 && intersects[0].object.name != "outside") {
                if (intersects[0].object.parent.name == "ally") {
                    if (intersects[0].object.parent.isSelected == false) {
                        thisAlly = intersects[0].object.parent
                        objectsToMove.push(intersects[0].object.parent)
                        thisAlly.isSelected = true
                        console.log(objectsToMove[objectsToMove.length - 2]);
                        if (objectsToMove.length == 2)
                            allyclickedVect = objectsToMove[objectsToMove.length - 2].getPlayerCont().position
                        else
                            allyclickedVect = objectsToMove[objectsToMove.length - 2].position
                        allydirectionVect = allyclickedVect.clone().sub(thisAlly.position).normalize() 
                        var angle = Math.atan2(
                            thisAlly.position.clone().x - allyclickedVect.x,
                            thisAlly.position.clone().z - allyclickedVect.z
                        )
                        allyAdded = true
                        thisAlly.axes.rotation.y = angle + Math.PI
                        thisAlly.mesh.rotation.y = angle - Math.PI / 2
                        allyWay = thisAlly.position.clone().distanceTo(allyclickedVect)
                        ai = 0
                        thisAlly.setAnimation("run")
                        console.log("RUN");
                    }
                    else {
                        for (let i = 1; i < objectsToMove.length; i++) {
                            if (objectsToMove[i].id == intersects[0].object.parent.id) {
                                intersects[0].object.parent.isSelected = false
                                objectsToMove[i].setAnimation("stand")
                                objectsToMove.splice(i, 1)
                            }
                        }
                    }
                    console.log(objectsToMove);

                }
                else {
                    clickedVect = intersects[0].point
                    console.log(clickedVect)
                    directionVect = clickedVect.clone().sub(model.getPlayerCont().position).normalize() 

                    console.log(model.getPlayerCont().position.clone().distanceTo(clickedVect))
                    var angle = Math.atan2(
                        model.getPlayerCont().position.clone().x - clickedVect.x,
                        model.getPlayerCont().position.clone().z - clickedVect.z
                    )
                    model.getPlayerMesh().rotation.y = angle - Math.PI / 2
                    model.getPlayerAxes().rotation.y = angle + Math.PI
                    way = model.getPlayerCont().position.clone().distanceTo(clickedVect)

                    if (objectsToMove.length > 1) {
                        for (let i = 1; i < objectsToMove.length; i++) {
                            allyclickedVect = model.getPlayerCont().position
                            allydirectionVect = allyclickedVect.clone().sub(objectsToMove[i].position).normalize() 
                            var angle = Math.atan2(
                                objectsToMove[i].position.clone().x - allyclickedVect.x,
                                objectsToMove[i].position.clone().z - allyclickedVect.z
                            )
                            objectsToMove[i].axes.rotation.y = angle + Math.PI
                            objectsToMove[i].mesh.rotation.y = angle - Math.PI / 2
                            allyWay = objectsToMove[i].position.clone().distanceTo(allyclickedVect) - 100
                            console.log(allyWay);
                            if (objectsToMove[i].animationPlaying != "run")
                                objectsToMove[i].setAnimation("run")
                            // objectsToMove[i].isMoving = true
                        }
                    }
                    // the normalize () function used above converts the x, y, coordinates proportionally from the vector to the range 0-1
                    // it is required by the following functions
                    sphere.position.set(clickedVect.x, (Settings.a / 20), clickedVect.z)
                    meters = 0
                    playOnce = false
                    if (model.animationPlaying != "run" || model.animationPlaying == "start") {
                        model.stopAnimation("stand")
                        model.setAnimation("run")
                    }
                }
            }
        })
        $(document).mouseup(function (event) {
            isClick = false
        })


        // handes mouse vector changing and getting intersections; showing and hiding ring around allies
        $(document).mousemove(function (event) {
            if (level3d.loadingComplete == true) {
                mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
                mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
                raycaster.setFromCamera(mouseVector, camera);
                intersects = raycaster.intersectObjects(level3d.clickable, true);


                if (intersects[0].object.parent.name == "ally" && intersects[0].object.parent.isRing == false) {
                    if (allyWithRing != null) {
                        allyWithRing.ring.material.opacity = 0
                        allyWithRing.isRing = false
                    }
                    intersects[0].object.parent.ring.material.opacity = 50
                    intersects[0].object.parent.isRing == true
                    allyWithRing = intersects[0].object.parent
                }
                else if (allyWithRing != null) {
                    if (allyWithRing.ring.material.opacity == 50) {
                        allyWithRing.ring.material.opacity = 0
                        allyWithRing.isRing = false
                        allyWithRing = null
                    }
                }
            }
        })

        let objects = []
        objects.concat(level3d.floors)
        objects.concat(level3d.allies)
    }

    var a = 0
    var playOnce = true

    // RENDERING
    function render() {
        // after user selects the level to play, rendering starts by placing new Player model (it is only performed once; "a" variable).
        // next it check model mixer for player and allies and updathe their models.
        if (level3d.levelChoosed == true) {
            if (a == 0) {
                newPlayer()
                a++
            }
            // updating model of player and allies
            if (model.mixer) model.updateModel()

            for (let k = 0; k < level3d.allies.length; k++) {
                if (level3d.allies[k].mixer) level3d.allies[k].updateModel()
            }
        }

        /* all operations after the game starts:
            - ring around allies rotation
            - movement of player from its posiotion to clicked place with change of animations
        */
        if (level3d.gameStarted == true) {
            // ring around allies rotation
            if (allyWithRing != null) {
                allyWithRing.ring.rotation.z += 0.04
            }

            // movement of player from its posiotion to clicked place. It ends when "meters" (distance traveled) >= "way" (whole distance)
            if (meters < way) {
                model.getPlayerCont().translateOnAxis(directionVect, (Settings.a / 100) * (3 / 2)) 
                model.getPlayerCont().position.y = (Settings.a / 5) + 25
                if (objectsToMove.length > 1) {
                    for (let i = 1; i < objectsToMove.length; i++) {
                        if (i == 1)
                            allyclickedVect = model.getPlayerCont().position
                        else
                            allyclickedVect = objectsToMove[i - 1].position
                        allydirectionVect = allyclickedVect.clone().sub(objectsToMove[i].position).normalize() // sub -> subtract player position from click position
                        allyWay = objectsToMove[i].position.clone().distanceTo(allyclickedVect)
                        var angle = Math.atan2(
                            objectsToMove[i].position.clone().x - allyclickedVect.x,
                            objectsToMove[i].position.clone().z - allyclickedVect.z
                        )
                        objectsToMove[i].axes.rotation.y = angle + Math.PI
                        objectsToMove[i].mesh.rotation.y = angle - Math.PI / 2
                        if (allyWay > (Settings.a / 100) * 60) {
                            objectsToMove[i].translateOnAxis(allydirectionVect, (Settings.a / 100) * (3 / 2))
                            objectsToMove[i].position.y = (Settings.a / 5) + 25
                        }
                    }
                }
                meters += (Settings.a / 100) * (3 / 2)
            }
            else { // stopping "run" animation and starting "stand" animation for the player and all allies (all objects to move)
                if (playOnce == false) {
                    model.stopAnimation("run")
                    model.setAnimation("stand")
                    for (let i = 1; i < objectsToMove.length; i++) {
                        // objectsToMove[i].isMoving = false
                        objectsToMove[i].setAnimation("stand")
                    }
                    playOnce = true
                    
                }
            }

            // moving ally to player (after user select an ally)
            if (ai + 100 < allyWay && allyAdded == true) {
                if (thisAlly.animationPlaying != "run")
                    thisAlly.setAnimation("run"); 
                // move operations 
                thisAlly.translateOnAxis(allydirectionVect, (Settings.a / 100) * (3 / 2)) 
                thisAlly.position.y = (Settings.a / 5) + 25 //block of changing y position
                ai += (Settings.a / 100) * (3 / 2)
            } else {
                if (allyAdded == true) {
                    if (playOnce != false)
                        if (thisAlly.animationPlaying == "run")
                            thisAlly.setAnimation("stand");
                    allyAdded = false
                }
            }

            // camera movement
            camera.position.x = model.getPlayerCont().position.x
            camera.position.z = model.getPlayerCont().position.z + 300 + Settings.a
            camera.position.y = model.getPlayerCont().position.y + 300 + Settings.a
            camera.lookAt(model.getPlayerCont().position)

        }

        if (level3d.loadingComplete == false && level3d.levelChoosed == true && level3d.gameStarted == true) {
            $("#loading").css("display", "none")
            console.log("LOADED");
            level3d.loadingComplete = true
        }


        requestAnimationFrame(render);
        console.log("render")
        renderer.render(scene, camera);
    }

    render();
})