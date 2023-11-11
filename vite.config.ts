import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    lib: {
      name: 'Snowboard',
      entry: '/src/index.tsx',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => `snowboard.${format}.js`,
    },
  },
});
