import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // This will now work with esModuleInterop enabled

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
