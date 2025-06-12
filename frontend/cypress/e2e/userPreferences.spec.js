describe('User Preferences Page', () => {
    beforeEach(() => {
        cy.window().then(win => win.localStorage.clear());

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
                font_style: 'arial',
                email_notifications: 0,
                push_notifications: 0,
                notification_frequency: 'daily',
                visibility: true
            }
        }).as('getPreferences');

        cy.intercept('PUT', 'http://localhost:8000/api/preferences/', {
            statusCode: 200,
            body: { message: 'Preferences updated' }
        }).as('updatePreferences');

        cy.visit('/');
        cy.wait(2000);
        cy.waitForWebix();
        cy.injectAxe();
    });



    it('should display login form and validate inputs', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
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
        cy.login();

        cy.clickTab('Account Settings');
        cy.get('[view_id="accountSettings"]', { timeout: 10000 }).should('be.visible');

        cy.clickTab('Notification Settings');
        cy.get('[view_id="notificationSettings"]', { timeout: 10000 }).should('be.visible');

        cy.clickTab('Theme Settings');
        cy.get('[view_id="themeSettings"]', { timeout: 10000 }).should('be.visible');

        cy.clickTab('Privacy Settings');
        cy.get('[view_id="privacySettings"]', { timeout: 10000 }).should('be.visible');
    });


    it('should save notification settings', () => {
        cy.login();

        cy.clickTab('Notification Settings');
        cy.get('[view_id="notificationSettings"]', { timeout: 10000 }).should('be.visible');
        cy.get('[view_id="email_notifications"] .webix_custom_checkbox', { timeout: 10000 }).should('be.visible').click();
        cy.get('[view_id="notification_frequency"] select', { timeout: 10000 }).select('Daily');
        cy.get('[view_id="$button1"] button', { timeout: 10000 }).click();

        cy.wait('@updatePreferences');
        cy.contains('Notification settings saved').should('be.visible');
    });

    it('should save theme settings and apply dark mode', () => {
        cy.login();

        cy.clickTab('Theme Settings');
        cy.get('[view_id="themeSettings"]', { timeout: 10000 }).should('be.visible');
        cy.get('[view_id="dark_mode"] .webix_custom_checkbox', { timeout: 10000 }).should('be.visible').click();
        cy.get('[view_id="save_theme_button"] button', { timeout: 10000 }).click();

        cy.wait('@updatePreferences');
        cy.get('body').should('have.class', 'dark-theme');
        cy.contains('Theme settings saved').should('be.visible');
    });

    it('should save privacy settings', () => {
        cy.login();

        cy.clickTab('Privacy Settings');
        cy.get('[view_id="privacySettings"]', { timeout: 10000 }).should('be.visible');
        cy.get('[view_id="visibility"] .webix_custom_checkbox', { timeout: 10000 }).should('be.visible').click();
        cy.get('[view_id="save_privacy_button"] button', { timeout: 10000 }).click();

        cy.wait('@updatePreferences');
        cy.contains('Privacy settings saved').should('be.visible');
    });


    it('should be responsive on mobile', () => {
        cy.viewport('iphone-x');
        cy.login();

        cy.clickTab('Account Settings');
        cy.get('[view_id="accountSettings"]').should('be.visible');

        cy.clickTab('Notification Settings');
        cy.get('[view_id="notificationSettings"]').should('be.visible');
    });

    it('should validate and save account settings', () => {
        cy.login();

        cy.clickTab('Account Settings');

        cy.get('[view_id="accountEmail"] input', { timeout: 10000 }).clear().type('test@example.com');

        // Click Change Password
        cy.get('[view_id="changePasswordBtn"]', { timeout: 10000 }).should('be.visible').click();

        // Debug password layout visibility
        cy.window().then((win) => {
            const layout = win.webix && win.webix.$$("passwordFieldsLayout");
            expect(layout, 'passwordFieldsLayout should exist').to.exist;
            expect(layout.isVisible(), 'passwordFieldsLayout should be visible').to.be.true;
        });

        // Try again to get newPassword input
        cy.get('[view_id="newPassword"] input', { timeout: 10000 }).should('exist').and('be.visible');
        cy.get('[view_id="newPassword"] input').clear().type('NewPass123');
        cy.get('[view_id="confirmPassword"] input').type('NewPass123');

        cy.get('[view_id="accountSaveBtn"]').click();

        cy.wait('@updatePreferences');
        cy.contains('Account settings saved').should('be.visible');
    });



    it('should validate password requirements', () => {
        cy.login();

        cy.clickTab('Account Settings');
        cy.get('[view_id="changePasswordBtn"]', { timeout: 10000 }).click();
        cy.get('[view_id="newPassword"] input').clear().type('weak');
        cy.get('.password-requirements').should('contain', '✗ At least 8 characters');
        cy.get('[view_id="newPassword"] input').clear().type('StrongPass123');
        cy.get('.password-requirements').should('contain', '✓ At least 8 characters');
    });




});
