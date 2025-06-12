Cypress.Commands.add('clickTab', (label) => {
    cy.contains('.webix_item_tab_text', label, { timeout: 20000 }).click();
});

Cypress.Commands.add('login', () => {
    cy.get('[view_id="usernameInput"] input', { timeout: 20000 }).type('testuser');
    cy.get('[view_id="passwordInput"] input').type('testpass');
    cy.get('[view_id="loginBtn"]').click();
    cy.wait('@login');
    cy.wait('@getPreferences');
});
