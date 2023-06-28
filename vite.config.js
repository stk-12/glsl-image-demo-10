import { defineConfig } from 'vite';
import glslify from 'rollup-plugin-glslify';

export default defineConfig({
  base: "/glsl/vertex_image09/",
  plugins: [glslify()]
});