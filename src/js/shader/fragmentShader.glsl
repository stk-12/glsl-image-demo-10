varying vec2 vUv;
varying float vDistortion;
uniform sampler2D uTex;
uniform sampler2D uTex2;
uniform sampler2D uTexDisp;
uniform float uProg;

// float parabola( float x, float k ) {
//   return pow( 4. * x * ( 1. - x ), k );
// }

void main() {
  vec2 uv = vUv;

  // vec3 texDisp = texture2D(uTexDisp, uv).rgb;
  // float disp = texDisp.r;
  // disp = disp * parabola(uProg, 0.5);

  // vec2 dispUv = vec2(uv.x, uv.y - disp * 0.1);
  // vec2 dispUv2 = vec2(uv.x, uv.y + disp * 0.1);

  // vec3 tex1 = texture2D(uTex, dispUv).rgb;
  // vec3 tex2 = texture2D(uTex2, dispUv2).rgb;

  // vec3 tex1 = texture2D(uTex, uv + disp).rgb;
  // vec3 tex2 = texture2D(uTex2, uv + disp).rgb;

  // vec3 color = mix(tex1, tex2, uProg);

  vec3 color;

  if (gl_FrontFacing) {
    color = texture2D(uTex, uv).rgb;
  } else {
    color = texture2D(uTex2, uv).rgb;
  }



  gl_FragColor = vec4(color, 1.0);
}