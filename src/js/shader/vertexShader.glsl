varying vec2 vUv;
varying float vDistortion;
uniform float uProg;
uniform float uProg2;
uniform float uScroll;

float PI = 3.141592653589793238;

const float maxDelay = 0.5;
const float duration = 1.0 - maxDelay;

#pragma glslify: rotateY = require(glsl-rotate/rotateY);

void main() {
  vUv = uv;
  vec3 pos = position;

  float scroll = uScroll * 0.005;

  pos.y += cos(pos.x * PI) * 0.08 * scroll;


  float delay = ((pos.x + pos.y) * 0.5) * maxDelay;
  float tProg = clamp(uProg2 - delay, 0.0, duration) / duration;

  pos = rotateY(pos, PI * tProg);




  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}