import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env files
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tsconfigPaths(), svgr()],

    define: {
      // By default, Vite doesn't include shims for NodeJS/
      // necessary for segment analytics lib to work
      global: {},

      // Make environment variables accessible through process.env
      // The key difference is we're not using JSON.stringify for the entire object
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_AFFINDA_KEY': JSON.stringify(env.VITE_AFFINDA_KEY),
      'process.env.VITE_AFFINDA_WORKSPACE_ID': JSON.stringify(env.VITE_AFFINDA_WORKSPACE_ID),
      'process.env.VITE_GOOGLE_MAPS_ROOT_URL': JSON.stringify(env.VITE_GOOGLE_MAPS_ROOT_URL),
      'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      'process.env.VITE_PUBNUB_PUBLISH_KEY': JSON.stringify(env.VITE_PUBNUB_PUBLISH_KEY),
      'process.env.VITE_PUBNUB_SUBSCRIBE_KEY': JSON.stringify(env.VITE_PUBNUB_SUBSCRIBE_KEY),
    },
  };
});
