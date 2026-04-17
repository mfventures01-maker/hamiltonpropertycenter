module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime'
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'no-undef': 'error',
        'react/jsx-no-undef': 'error',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
