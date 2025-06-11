describe('User Preferences Page', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.injectAxe();
    });

    it('should display login form and validate inputs', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('testpass');
        cy.get('#loginBtn').click();
        cy.get('#mainView').should('have.attr', 'data-value', 'preferences');
        cy.get('#logoutBtn').should('be.visible');
    });

    it('should show error on invalid login', () => {
        cy.get('#usernameInput input').type('testuser');
        cy.get('#passwordInput input').type('wrong');
        cy.get('#loginBtn').click();
        cy.contains('Invalid username or password').should('be.visible');
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