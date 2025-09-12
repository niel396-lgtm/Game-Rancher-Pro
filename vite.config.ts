import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// FIX: __dirname is not available in ES modules. This is the standard way to get the directory name of the current module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
