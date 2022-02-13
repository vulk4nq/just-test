import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

let SCENE;
let CAMERA;
let RENDERER;

let LOADING_MANAGER;
let IMAGE_LOADER;
let OBJ_LOADER;
let CONTROLS;
let MOUSE;
let RAYCASTER;

let TEXTURE;
let OBJECT;



main();


function main() {
    init();
    animate();
}


function init() {
    initScene();
    initCamera();
    initRenderer();
    initLoaders();
    initControls();
    initRaycaster();
    initWorld();
    initTexture();

    loadTexture();
    loadModel();

    initEventListeners();
    

    document.querySelector('.canvas-container').appendChild(RENDERER.domElement);
    
}


function initScene() {
    SCENE = new THREE.Scene();

    initLights();
}


function initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    SCENE.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left   = -50;
    directionalLight.shadow.camera.right  =  50;
    directionalLight.shadow.camera.top    =  50;
    directionalLight.shadow.camera.bottom = -50;

    SCENE.add(directionalLight);
}


function initCamera() {
    CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    CAMERA.position.z = 100;
}


function initRenderer() {
    RENDERER = new THREE.WebGLRenderer({ alpha: true });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(window.innerWidth, window.innerHeight);
    RENDERER.shadowMap.enabled = true;
    RENDERER.shadowMapSort = true;
}
function initLoaders() {
    LOADING_MANAGER = new THREE.LoadingManager();
    IMAGE_LOADER = new THREE.ImageLoader(LOADING_MANAGER);
    OBJ_LOADER = new OBJLoader(LOADING_MANAGER);
}
function initControls() {
    CONTROLS = new OrbitControls(CAMERA,document.querySelector('.canvas-container'));
    CONTROLS.minPolarAngle = Math.PI * 1 / 4;
    CONTROLS.maxPolarAngle = Math.PI * 3 / 4;
    CONTROLS.minDistance = 10;
    CONTROLS.maxDistance = 150;
    CONTROLS.autoRotate = true;
    CONTROLS.autoRotateSpeed = -1.0;
    CONTROLS.update();

    MOUSE = new THREE.Vector2();
}


function initRaycaster() {
    RAYCASTER = new THREE.Raycaster();
}
function initTexture() {
    TEXTURE = new THREE.Texture();
}
function initWorld() {
    const sphere = new THREE.SphereGeometry(500, 64, 64);
    sphere.scale(-1, 1, 1);

    const texture = new THREE.Texture();

    const material = new THREE.MeshBasicMaterial({
        map: texture
    });

    IMAGE_LOADER.load('world.jpg', (image) => {
        texture.image = image;
        texture.needsUpdate = true;
    });

    SCENE.add(new THREE.Mesh(sphere, material));
}
function loadTexture() {
    IMAGE_LOADER.load('./texture.jpg', (image) => {
        TEXTURE.image = image;
        TEXTURE.needsUpdate = true;
    });
}
function loadModel() {
    OBJ_LOADER.load('./model.obj', (object) => {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                switch (child.material.name) {
                    case 'Texture':
                        child.material.map = TEXTURE;
                        break;
                    case 'red':
                        child[_IS_ANIMATED] = false;
                        child.material.color.setHSL(Math.random(), 1, 0.5);
                        break;
                    case 'pink':
                        child[_IS_ANIMATED] = false;
                        child.material.color.setHSL(Math.random(), 1, 0.5);
                        break;
                }
            }
        });

        object.scale.x = 1;
        object.scale.y = 1;
        object.scale.z = 1;
        
        object.position.y = -10;

        OBJECT = object;
        SCENE.add(OBJECT);
    });
}


function initEventListeners() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    onWindowResize();
}
function onWindowResize() {
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();

    RENDERER.setSize(window.innerWidth, window.innerHeight);
    
}
function onMouseMove(event) {
    MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
    MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function animate() {
    requestAnimationFrame(animate);
    CONTROLS.update();
    render();
}
function render() {
    CAMERA.lookAt(SCENE.position);

    RAYCASTER.setFromCamera(MOUSE, CAMERA);
    RENDERER.render(SCENE, CAMERA);
}

