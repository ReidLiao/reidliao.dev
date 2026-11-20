module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        'chrome 111',
        'edge 111',
        'firefox 111',
        'safari 16.4',
      ],
    },
  },
}
