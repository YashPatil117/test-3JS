import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Set up the renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// camera properties
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;

// Perspective Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2; // Set camera distance from the scene

// Create a scene
const scene = new THREE.Scene();

//  group to hold the Earth and light map, and apply axial tilt
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Earth's axial tilt
scene.add(earthGroup);

// Set up orbit controls to allow user interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.03;

// Load textures
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('00_earthmap1k.jpg');
const lightmapTexture = loader.load('03_earthlights1k.jpg');

//  sphere geometry (higher detail for smoother surface)
const geo = new THREE.SphereGeometry(1.0, 64, 64);

//  Earth Material
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture, // Apply Earth texture
  flatShading: false
});

// Create Earth Mesh and add it to the group
const earthmesh = new THREE.Mesh(geo, earthMaterial);
earthGroup.add(earthmesh);

// Create Light Map Material (city lights)
const lightsMaterial = new THREE.MeshBasicMaterial({ 
  map: lightmapTexture, // Apply light map texture
  transparent: true, // Allow transparency
  opacity: 0.8, // Set visibility of city lights
  depthWrite: false, // Prevents depth issues when overlaying
  blending: THREE.AdditiveBlending // Makes light add to the scene instead of covering it
});

// Create Light Map Mesh, scale it slightly to prevent z-fighting, and add it to the group
const lightsmesh = new THREE.Mesh(geo, lightsMaterial);
lightsmesh.scale.set(1.01, 1.01, 1.01); // Slightly larger to prevent overlap issues
earthGroup.add(lightsmesh);

// Add a directional light to simulate sunlight
const sunlight = new THREE.DirectionalLight(0xffffff, 1.0); // White light with full intensity
sunlight.position.set(-2, 2, 3); // Positioning the light source
scene.add(sunlight);

// Animation loop to continuously update the scene
function animate(t = 0) {
  requestAnimationFrame(animate);

  // Rotate the entire Earth group to make both the Earth and light map rotate
  earthGroup.rotation.y = t / 10000;

  // Render the scene
  renderer.render(scene, camera);

  // Update camera controls if damping is enabled
  if (controls.enableDamping) {
    controls.update();
  }
}

// Start the animation loop
animate();
