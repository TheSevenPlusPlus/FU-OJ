// tailwind.config.js
module.exports = {
    content: [
        './src/**/*.{html,js,jsx,ts,tsx}', // Adjust paths as necessary
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                border: 'var(--border)',
                // Add more custom colors if needed
            },
        },
    },
    plugins: [],
};
