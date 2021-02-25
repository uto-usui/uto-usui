// precision mediump float;

uniform sampler2D u_texture;
uniform float time;
uniform float seed;

varying vec2 vUv;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

  #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

float pattern(vec2 p) {
  // vec2 pp = vec2(snoise2(p + vec2(0.0, 0.0)), snoise2(p + vec2(5.2 + time * 0.16, 1.3)));
  vec2 pp = vec2(snoise2(p + vec2(0.0, 0.0)), snoise2(p + vec2(5.4 + time * 0.11, 1.1)));
  return snoise2(pp);
}

void main() {
  vec2 uv = vUv;

  float n = pattern(vec2(uv.x * 2.0, uv.y * 12.0) + vec2(seed));
  n = pow(n * 0.8, 8.0);
  uv += 0.2 * n;

  vec4 color = texture2D(u_texture, uv);
  float mask = 1.0 - color.a;
  color.rgb -= 0.1 * random(uv * 5.0) * mask;

  gl_FragColor = color;
}
