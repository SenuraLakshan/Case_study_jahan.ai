const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174', // Point to your app’s local server
    specPattern: 'cypress/e2e/**/*.spec.js', // Pattern for test files
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Optional: Add plugins or custom tasks here
    }
  }
});