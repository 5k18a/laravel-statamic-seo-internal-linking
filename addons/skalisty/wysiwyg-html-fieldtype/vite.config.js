import * as Vue from 'vue';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function statamicVueExternals() {
    const resolvedVirtualModuleId = '\0vue-external';
    const vueExports = Object.keys(Vue).filter(
        (key) => key !== 'default' && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
    );

    return {
        name: 'statamic-externals',
        enforce: 'pre',

        resolveId(id) {
            if (id === 'vue') {
                return resolvedVirtualModuleId;
            }

            return null;
        },

        load(id) {
            if (id === resolvedVirtualModuleId) {
                const exportsList = vueExports.join(', ');

                return `
                    const Vue = window.Vue;
                    export default Vue;
                    export const { ${exportsList} } = Vue;
                `;
            }

            return null;
        },
    };
}

export default defineConfig({
    plugins: [
        statamicVueExternals(),
        vue(),
    ],
    build: {
        outDir: 'resources/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'resources/js/addon.js'),
            external: ['vue'],
            output: {
                format: 'iife',
                name: 'WysiwygHtmlAddon',
                globals: { vue: 'Vue' },
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
});
