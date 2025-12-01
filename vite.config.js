import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';

const env = loadEnv('', process.cwd());

const host = env.VITE_HOST || '0.0.0.0';
const port = env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173;
const hmrHost = env.VITE_HMR_HOST || 'mac-mini-i7.local';
const hmrPort = env.VITE_HMR_PORT ? parseInt(env.VITE_HMR_PORT) : 5173;

export default defineConfig({
    plugins: [
        basicSsl(),
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    server: {
        host,
        port,
        hmr: {
            host: hmrHost,
            port: hmrPort,
            protocol: 'wss',
        },
    },
});