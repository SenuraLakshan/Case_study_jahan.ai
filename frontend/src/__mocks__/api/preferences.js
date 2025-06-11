// src/__mocks__/api/preferences.js
export const getPreferences = jest.fn().mockResolvedValue({
    username: 'testuser',
    email: 'test@example.com',
    email_notifications: 1,
    push_notifications: 0,
    notification_frequency: 'daily',
    primary_color: '#0000FF',
    dark_mode: 0,
    font_style: 'arial',
    visibility: true,
    two_factor_auth: false,
    data_sharing: true
});

export const updatePreferences = jest.fn().mockResolvedValue({
    username: 'testuser',
    email: 'test@example.com'
});