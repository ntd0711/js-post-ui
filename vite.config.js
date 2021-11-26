const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                addEditPage: resolve(__dirname, 'add-edit-page.html'),
                detailPage: resolve(__dirname, 'details-page.html'),
            },
        },
    },
})
