import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geo = new THREE.IcosahedronGeometry(1.0, 8);
const loader = new THREE.TextureLoader();
const mat = new THREE.MeshStandardMaterial({
  map: loader.load('8081_earthmap2k.jpg'),
  flatShading: false
});

// Created Earth Mesh
const earthmesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthmesh);

// Created Light Material and Mesh
const lightsmat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const lightsmesh = new THREE.Mesh(geo, lightsmat);
earthGroup.add(lightsmesh);

// Add Directional Light
const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(-2, 2, 3);
scene.add(sunlight);

function animate(t = 0) {
  requestAnimationFrame(animate);

  earthmesh.rotation.y = t / 10000;
  renderer.render(scene, camera);

  if (controls.enableDamping) {
    controls.update();
  }
}
animate();
