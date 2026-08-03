const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");

module.exports = defineConfig([
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },
            ecmaVersion: 12,
            sourceType: "commonjs",
        },
        rules: {
            "space-before-function-paren": 0,
        },
    },
    {
        files: ["test/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
    },
]);
