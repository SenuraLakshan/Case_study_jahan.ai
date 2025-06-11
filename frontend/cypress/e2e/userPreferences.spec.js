describe('User Preferences Page', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
        });

        cy.intercept('POST', 'http://localhost:8000/api/token/', {
            statusCode: 200,
            body: { access: 'mock-access-token', refresh: 'mock-refresh-token' }
        }).as('login');
        cy.intercept('GET', 'http://localhost:8000/api/preferences/', {
            statusCode: 200,
            body: {
                username: 'testuser',
                email: 'test@example.com',
                primary_color: '#0000FF',
                dark_mode: 0,
                font_style: 'arial'
            }
        }).as('getPreferences');
        cy.intercept('PUT', 'http://localhost:8000/api/preferences/', {
            statusCode: 200,
            body: { message: 'Preferences updated' }
        }).as('updatePreferences');

        cy.visit('/');
        cy.wait(5000);
        cy.waitForWebix();
        cy.injectAxe();
        // cy.pause();
    });

    it('should display login form and validate inputs', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="mainView"]', { timeout: 20000 }).should('have.attr', 'data-value', 'preferencesView');
        cy.get('[view_id="logoutBtn"]', { timeout: 20000 }).should('be.visible');
    });

    it('should show error on invalid login', () => {
        cy.intercept('POST', 'http://localhost:8000/api/token/', {
            statusCode: 401,
            body: { detail: 'Invalid username or password' }
        }).as('failedLogin');
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('wrong');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@failedLogin');
        cy.contains('Invalid username or password').should('be.visible');
    });
    it('should navigate between preference tabs', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#accountTab').click();
        cy.get('#accountSettings').should('be.visible');
        cy.get('#notificationTab').click();
        cy.get('#notificationSettings').should('be.visible');
        cy.get('#themeTab').click();
        cy.get('#themeSettings').should('be.visible');
        cy.get('#privacyTab').click();
        cy.get('#privacySettings').should('be.visible');
    });

    it('should validate and save account settings', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#accountTab').click();
        cy.get('#accountEmail input').type('test@example.com');
        cy.get('#changePasswordBtn').click();
        cy.get('#newPassword input').type('NewPass123');
        cy.get('#confirmPassword input').type('NewPass123');
        cy.get('#accountSaveBtn').click();
        cy.contains('Account settings saved').should('be.visible');
    });

    it('should validate password requirements', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#accountTab').click();
        cy.get('#changePasswordBtn').click();
        cy.get('#newPassword input').type('weak');
        cy.get('.password-requirements').should('contain', '✗ At least 8 characters');
        cy.get('#newPassword input').clear().type('StrongPass123');
        cy.get('.password-requirements').should('contain', '✓ At least 8 characters');
    });

    it('should save notification settings', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#notificationTab').click();
        cy.get('input[name="email_notifications"]').check();
        cy.get('select[name="notification_frequency"]').select('Daily');
        cy.get('button[value="Save"]').eq(0).click();
        cy.contains('Notification settings saved').should('be.visible');
    });

    it('should save theme settings and apply dark mode', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#themeTab').click();
        cy.get('input[name="dark_mode"]').check();
        cy.get('button[value="Save"]').eq(0).click();
        cy.get('body').should('have.class', 'dark-theme');
        cy.contains('Theme settings saved').should('be.visible');
    });

    it('should save privacy settings', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#privacyTab').click();
        cy.get('input[name="visibility"]').check();
        cy.get('button[value="Save"]').eq(0).click();
        cy.contains('Privacy settings saved').should('be.visible');
    });

    it('should be accessible', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.checkA11y();
    });

    it('should be responsive on mobile', () => {
        cy.viewport('iphone-x');
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#accountTab').click();
        cy.get('#accountSettings').should('be.visible');
        cy.get('#notificationTab').click();
        cy.get('#notificationSettings').should('be.visible');
    });
});