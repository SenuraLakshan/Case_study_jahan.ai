// src/__mocks__/api/auth.js
export const login = jest.fn().mockImplementation((username, password) => {
    if (username === 'testuser' && password === 'testpass') {
        // Simulate successful login
        localStorage.setItem('access_token', 'mock-access-token');
        localStorage.setItem('refresh_token', 'mock-refresh-token');
        return Promise.resolve({ access: 'mock-access-token', refresh: 'mock-refresh-token' });
    }
    // Simulate failed login
    return Promise.reject({ detail: 'Invalid username or password' });
});

export const getToken = jest.fn().mockImplementation(() => {
    return localStorage.getItem('access_token') || 'mock-access-token';
});