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
        cy.wait(5000);
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
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.wait(2000);
        cy.get('[view_id="preferencesTabbar"] [button_id="accountTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="accountSettings"]', { timeout: 20000 }).should('be.visible');
        cy.get('[view_id="preferencesTabbar"] [button_id="notificationTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="notificationSettings"]', { timeout: 20000 }).should('be.visible');
        cy.get('[view_id="preferencesTabbar"] [button_id="themeTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="themeSettings"]', { timeout: 20000 }).should('be.visible');
        cy.get('[view_id="preferencesTabbar"] [button_id="privacyTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="privacySettings"]', { timeout: 20000 }).should('be.visible');
    });

    it('should validate and save account settings', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="preferencesTabbar"] [button_id="accountTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="accountEmail"] input', { timeout: 20000 }).type('test@example.com');
        cy.get('[view_id="changePasswordBtn"]', { timeout: 20000 }).click();
        cy.get('[view_id="newPassword"] input', { timeout: 20000 }).type('NewPass123');
        cy.get('[view_id="confirmPassword"] input', { timeout: 20000 }).type('NewPass123');
        cy.get('[view_id="accountSaveBtn"]', { timeout: 20000 }).click();
        cy.wait('@updatePreferences');
        cy.contains('Account settings saved').should('be.visible');
    });

    it('should validate password requirements', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="preferencesTabbar"] [button_id="accountTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="changePasswordBtn"]', { timeout: 20000 }).click();
        cy.get('[view_id="newPassword"] input', { timeout: 20000 }).type('weak');
        cy.get('.password-requirements').should('contain', '✗ At least 8 characters');
        cy.get('[view_id="newPassword"] input', { timeout: 20000 }).clear().type('StrongPass123');
        cy.get('.password-requirements').should('contain', '✓ At least 8 characters');
    });

    it('should save notification settings', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="preferencesTabbar"] [button_id="notificationTab"]', { timeout: 20000 }).click();
        cy.get('input[name="email_notifications"]', { timeout: 20000 }).check();
        cy.get('select[name="notification_frequency"]', { timeout: 20000 }).select('Daily');
        cy.get('button[value="Save"]', { timeout: 20000 }).eq(0).click();
        cy.wait('@updatePreferences');
        cy.contains('Notification settings saved').should('be.visible');
    });

    it('should save theme settings and apply dark mode', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="preferencesTabbar"] [button_id="themeTab"]', { timeout: 20000 }).click();
        cy.get('input[name="dark_mode"]', { timeout: 20000 }).check();
        cy.get('button[value="Save"]', { timeout: 20000 }).eq(0).click();
        cy.wait('@updatePreferences');
        cy.get('body').should('have.class', 'dark-theme');
        cy.contains('Theme settings saved').should('be.visible');
    });

    it('should save privacy settings', () => {
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="preferencesTabbar"] [button_id="privacyTab"]', { timeout: 20000 }).click();
        cy.get('input[name="visibility"]', { timeout: 20000 }).check();
        cy.get('button[value="Save"]', { timeout: 20000 }).eq(0).click();
        cy.wait('@updatePreferences');
        cy.contains('Privacy settings saved').should('be.visible');
    });

    it('should be responsive on mobile', () => {
        cy.viewport('iphone-x');
        cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
        cy.get('[view_id="passwordInput"] input', { timeout: 20000 }).type('testpass');
        cy.get('[view_id="loginBtn"]', { timeout: 20000 }).click();
        cy.wait('@login');
        cy.get('[view_id="preferencesTabbar"] [button_id="accountTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="accountSettings"]', { timeout: 20000 }).should('be.visible');
        cy.get('[view_id="preferencesTabbar"] [button_id="notificationTab"]', { timeout: 20000 }).click();
        cy.get('[view_id="notificationSettings"]', { timeout: 20000 }).should('be.visible');
    });
});