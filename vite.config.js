export default {
    base: '',
    build: {
        minify: false,
        modulePreload: false,
        
        // Set modern browser targets that support top-level await
        target: 'es2022',
        outDir: 'build',

        rebaseConfig: false
    }
}
