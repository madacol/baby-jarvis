export default {
    base: '',
    build: {
        // Set modern browser targets that support top-level await
        target: 'es2022',
        outDir: 'build',

        minify: false,
        modulePreload: false,
        rebaseConfig: false
    }
}
