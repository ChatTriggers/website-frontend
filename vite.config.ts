import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), monacoEditorPlugin({})],
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
});
