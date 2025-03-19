import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";


const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w/h;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 2;

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03




const geo = new THREE.IcosahedronGeometry(1.0,2);
const cube = new THREE.BoxGeometry(2.0,2.0,2.0);
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff, // Incorrect: Only 4 digits (should be 6 digits)
  flatShading: true
});

const mesh = new THREE.Mesh(geo,mat);
const cubemesh = new THREE.Mesh(cube,mat);
cubemesh.position.set(3,3,3);
mesh.add(cubemesh);

scene.add(mesh);



const hemilight = new THREE.HemisphereLight(0x0099ff,0xaa5500);
scene.add(hemilight);

const wireframe = new THREE.MeshBasicMaterial({
  color:0xffffff,
  wireframe: true
})
const wiremesh = new THREE.Mesh(geo,wireframe)
wiremesh.scale.setScalar(1.001);
mesh.add(wiremesh)
function animate(t = 0){
  requestAnimationFrame(animate);
  mesh.rotation.y = t * 0.0001;

  renderer.render(scene,camera);
  
  if (controls.enableDamping)
  {
    controls.update();
  }
  
}
animate();
