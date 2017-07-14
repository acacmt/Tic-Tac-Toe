var renderer = null,
    scene = null,
    camera = null,
    mesh = null;
var flag = false;
var win = [[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6]];
var playerA = [];
var playerB = [];
var gameWin = false;
// var intersects;

window.onload = function init() {

    //RENDERER
    renderer = new THREE.WebGLRenderer();
    // Set the viewport 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#e6d6fe");
    document.body.appendChild(renderer.domElement);

    //SCENE
    scene = new THREE.Scene();
    // var axes = new THREE.AxisHelper(200);
    // scene.add(axes)

    //LIGHT
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    //CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200);
    // position and point the camera to the center of the scene
    camera.position.set(-5, 30, 10);
    camera.lookAt(scene.position);

    //CONTROLS
    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls = new THREE.OrbitControls(camera);
    //controls.addEventListener('change', function () {
    //    renderer.render(scene, camera);
    //});

    //SHOW CANVAS
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    var render = function () {
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);

    };

    var cubeNumber = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            addCube(i, j, cubeNumber);
            cubeNumber++;
        }
    }

    //console.log(scene)
    render();
    window.addEventListener('mousedown', onClick, false);

}

//CUBES
function addCube(x, z, cubeNumber) {
    var cubeSize = 4;
    var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    var cubeMaterial = new THREE.MeshDepthMaterial();

    var colorMaterial = new THREE.MeshBasicMaterial({
        color: 0x008080
    });

    //2nd - Blend multiple materials
    var cube = new THREE.Mesh(cubeGeometry, colorMaterial);
    //console.log(cube)

    // position the cube randomly in the scene
    cube.position.x = x * 6 - 6;
    cube.position.z = z * 6 - 6;

    cube.changeColor = true;
    cube.number = cubeNumber;

    // add the cube to the scene
    scene.add(cube);
}

//PICKING
function onClick(e) {

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    //console.log(flag);
    if (intersects[0].object.changeColor == true) {
        //console.log(intersects);
        if (!flag) {
            flag = true;
            playerA.push(intersects[0].object.number);
            intersects[0].object.changeColor = false;
            intersects[0].object.material.color.set(0x800000);
            //console.log(intersects);
        } else {
            flag = false;
            playerB.push(intersects[0].object.number);
            intersects[0].object.changeColor = false
            intersects[0].object.material.color.set(0x000080);
            //console.log(intersects);
        }
        checkWin();
        if (playerA.length + playerB.length >= 9 && gameWin == false) {
            checkDraw();
        }
    }
}

//CHECK WINNER
function checkWin() {
    var playerCubes = [];
    var winMessage = "";
    if (flag) {
        playerCubes = playerA;
        winMessage = "JOGADOR VERMELHO GANHOU!";
    }
    else {
        playerCubes = playerB;
        winMessage = "JOGADOR AZUL GANHOU!";
    }
    for (var i = 0; i < win.length; i++) {
        var count = 0;
        for (var j = 0; j < win[i].length; j++) {
            for (var k = 0; k < playerCubes.length; k++) {
                if (win[i][j] == playerCubes[k]) {
                    count++;
                    if (count == 3) {
                        gameWin = true;
                        document.getElementById("text").innerHTML = winMessage;
                        window.removeEventListener('mousedown', onClick);
                    }
                }
            }
        }
    }
}

//CHECK DRAW
function checkDraw() {
    document.getElementById("text").innerHTML = "EMPATE!";
}

//RESTART THE GAME
function restart() {
    playerA = [];
    playerB = [];
    flag = false;
    gameWin = false;
    document.getElementById("text").innerHTML = "";
    for (var i = 1; i < scene.children.length; i++) {
        scene.children[i].material.color.set(0x008080);
        scene.children[i].changeColor = true;
    }
    window.addEventListener('mousedown', onClick, false);
}