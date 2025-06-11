# User Preferences Form

This is the frontend and backend for the User Preferences application, built with [Webix](https://webix.com/) for a responsive UI and [Cypress](https://www.cypress.io/) for end-to-end testing. The application allows users to log in, manage their account settings, notification preferences, theme settings, and privacy options through a tabbed interface.

## Features
- **Login Form**: Secure authentication with username and password.
- **Preferences Management**:
  - Theme Settings: Customize primary color, dark mode, and font style.
- **Responsive Design**: Adapts to desktop and mobile devices.
- **Accessibility**: Built with ARIA attributes for screen reader support.
- **End-to-End Testing**: Comprehensive Cypress tests for login and preferences functionality.

## Tech Stack
- **Framework**: Webix (UI components)
- **Testing**: Cypress (E2E testing)
- **Build Tool**: Vite (or Webpack, depending on your setup)
- **Language**: JavaScript (ES Modules)
- **Styling**: Webix CSS, custom styles
- **API Integration**: REST API calls for authentication and preferences using Django

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- Backend API running at `http://localhost:8000` (for `/api/token/` and `/api/preferences/` endpoints)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment**:
   - Ensure the backend API is running at `http://localhost:8000`.
   - No additional environment variables are required unless specified.

## Running the Application
1. **Development Mode**:
   ```bash
   npm run dev
   ```
   - Opens the app at `http://localhost:3000` (or another port if configured).
   - Supports hot module replacement (HMR) for live updates.

2. **Build for Production**:
   ```bash
   npm run build
   ```
   - Outputs optimized files to the `dist` directory.

3. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## Testing
1. **Run Cypress Tests** (Interactive):
   ```bash
   npm run cypress:open
   ```
   - Opens the Cypress Test Runner.
   - Tests are located in `cypress/e2e/userPreferences.spec.js`.

2. **Run Cypress Tests** (Headless):
   ```bash
   npm run cypress:run
   ```

3. **Test Coverage**:
   - Ensure the backend API is mocked or running.
   - Tests cover login, invalid login, theme settings, and responsive behavior.

## Project Structure
```
frontend/
├── cypress/
│   ├── e2e/
│   │   └── userPreferences.spec.js  # Cypress tests
│   └── support/
│       └── e2e.js                  # Custom Cypress commands
├── src/
│   ├── api/
│   │   ├── auth.js                 # Authentication API calls
│   │   └── preferences.js          # Preferences API calls
│   ├── components/
│   │   ├── LoginForm.js            # Login form component
│   │   ├── PreferencesForm.js      # Tabbed preferences form
│   │   ├── ThemeSettings.js        # Theme settings form
│   │   └── ...                     # Other settings components
│   ├── App.js                      # Main app configuration
│   ├── index.js                    # Entry point
│   └── index.html                  # HTML template
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Available Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.
- `npm run cypress:open`: Opens Cypress Test Runner.
- `npm run cypress:run`: Runs Cypress tests headlessly.

## API Endpoints
The frontend interacts with the following backend endpoints:
- `POST /api/token/`: Authenticates users and returns tokens.
- `GET /api/preferences/`: Fetches user preferences.
- `PUT /api/preferences/`: Updates user preferences.

Ensure the backend is configured to handle these requests.

## Troubleshooting
- **UI Not Rendering**:
  - Check console logs for Webix errors.
  - Verify Webix CDN (`https://cdn.webix.com/edge/`) is accessible.
  - Run `npm install webix@latest` if using a local Webix package.
- **Cypress Tests Failing**:
  - Ensure the app is running (`npm run dev`).
  - Check API mocks in `userPreferences.spec.js`.
  - Increase timeouts in tests if rendering is slow.
  - Run tests in Chrome: `npx cypress open --browser chrome`.
- **Redundant API Calls**:
  - Inspect `ThemeSettings.js` for multiple `onViewShow` triggers.
  - Use `onAfterRender` instead of `onViewShow` if needed.


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
