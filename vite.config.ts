import react from '@vitejs/plugin-react';

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const outDir = 'dist';

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [`process.env.${key}`]: `"${val}"`,
      };
    },
    {}
  );

  // if (command === 'build' && /(dev|qa|stage)/.test(mode)) {
  //   outDir = `dist-${mode}`;
  // }

  return {
    plugins: [react(), svgr()],
    base: env.VITE_ROUTER_BASE_PATH,
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        {
          find: '@context',
          replacement: path.resolve(__dirname, 'src/context'),
        },
        { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
        { find: '@lib', replacement: path.resolve(__dirname, 'src/lib') },
        {
          find: '@local-type',
          replacement: path.resolve(__dirname, 'src/type'),
        },
        {
          find: '@shared',
          replacement: path.resolve(__dirname, 'src/shared'),
        },
        {
          find: '@lib',
          replacement: path.resolve(__dirname, 'src/lib'),
        },
      ],
    },
    server: {
      host: 'localhost',
      port: parseInt(env.VITE_PORT || '3000', 10),
      fs: {
        allow: ['..'],
      },
    },
    build: {
      outDir,
    },
    define: envWithProcessPrefix,
  };
});
