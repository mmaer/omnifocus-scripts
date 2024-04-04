import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';
import copy from 'rollup-plugin-copy';

const { SCRIPT = '' } = process.env;

const scripts = [SCRIPT];

const scriptDir = './src/scripts/';

export default defineConfig({
  plugins: [tsconfigPaths(), eslint()],
  build: {
    minify: false,
    emptyOutDir: false,
    outDir: 'scripts',
    rollupOptions: {
      output: {
        entryFileNames: (file) => `${file.facadeModuleId?.split('/').at(-2)}/[name].omnijs`,
      },
      input: scripts.reduce((prev, next) => ({ ...prev, [next]: path.resolve(`${scriptDir}${next}/index.ts`)}), {}),
      plugins: [
        {
          name: 'wrap-in-iife',
          generateBundle(outputOptions, bundle) {
            Object.keys(bundle).forEach(fileName => {
              const file = bundle[fileName];

              if (fileName.includes('.omnijs') && 'code' in file) {
                const commentPath = [...(file.facadeModuleId ? file.facadeModuleId : '').split('/').slice(0, -1), 'description.json'].join('/');
                const commentfile = fs.readFileSync(commentPath, 'utf-8');

                file.code = `/*${commentfile}*/\n(() => {\n${file.code}\nreturn action;\n})();`;
              }
            });
          }
        },
        copy({
          targets: scripts.map(name => ({ src: `${scriptDir}${name}/README.md`, dest: `scripts/${name}` }))
        })
      ]
    }
  }
});