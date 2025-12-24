import path from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          if (id.includes('react-syntax-highlighter')) {
            return 'syntax-highlighter';
          }
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
            return 'markdown-renderer';
          }
          if (id.includes('lucide-react')) {
            return 'lucide-icons';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
