// tailwind.config.js
export default {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
    safelist: [{ pattern: /light:.*/ }],
    theme: { extend: {} },
    variants: {
        extend: {
            backgroundColor: ['light'],
            textColor: ['light'],
            borderColor: ['light'],
        },
    },
    plugins: [],
}
