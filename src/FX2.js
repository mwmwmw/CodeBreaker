import { MeshBasicMaterial, ShaderMaterial, Vector2, Layers } from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";

var ENTIRE_SCENE = 0,
  BLOOM_SCENE = 1;
var bloomLayer = new Layers();
bloomLayer.set(BLOOM_SCENE);

var params = {
  exposure: 1,
  bloomStrength: 5,
  bloomThreshold: 0,
  bloomRadius: 0
};

var darkMaterial = new MeshBasicMaterial({ color: "black" });
var materials = {};

var renderScene = new RenderPass(scene, camera);
var bloomPass = new UnrealBloomPass(
  new Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

var bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

var finalPass = new ShaderPass(
  new ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
    },
    vertexShader: `varying vec2 vUv;
								void main() {
									vUv = uv;
									gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
								}
			`,
    fragmentShader: `uniform sampler2D baseTexture;
								uniform sampler2D bloomTexture;
								varying vec2 vUv;
								vec4 getTexture( sampler2D texelToLinearTexture ) {
									return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
								}
								void main() {
									gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );
								}`,
    defines: {}
  }),
  "baseTexture"
);

var finalComposer = new EffectComposer(renderer);
var AApass = new SMAAPass(
  window.innerWidth * renderer.getPixelRatio(),
  window.innerHeight * renderer.getPixelRatio()
);
AApass.needsSwap = true;

finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);
finalComposer.addPass(AApass);

function renderBloom(mask) {
  if (mask === true) {
    scene.traverse(darkenNonBloomed);
    bloomComposer.render();
    scene.traverse(restoreMaterial);
  } else {
    camera.layers.set(BLOOM_SCENE);
    bloomComposer.render();
    camera.layers.set(ENTIRE_SCENE);
  }
}

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}
function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

function resize() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  const aspect = width / height;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  bloomComposer.setSize(width, height);
  finalComposer.setSize(width, height);
}

resize();

window.addEventListener("resize", resize);

function render() {
  renderBloom(true);
  finalComposer.render();
}

const layers = {
  BLOOM_SCENE,
  ENTIRE_SCENE
};
