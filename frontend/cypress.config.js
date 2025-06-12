const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Optional: Add plugins or custom tasks here
    }
  }
});