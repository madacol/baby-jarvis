export default {
    base: '',
    build: {
        // Set modern browser targets that support top-level await
        target: 'es2022',
        outDir: 'build',

        minify: false,
        modulePreload: false,
        rebaseConfig: false,

        // Ensure the default action files are included in the build
        rollupOptions: {
            input: {
                main: 'index.html',
            },
            output: {
                manualChunks: undefined,
            }
        }
    }
}
