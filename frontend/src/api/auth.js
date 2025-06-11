import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}token/`, { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data);
        throw error.response?.data || { detail: 'Invalid username or password' };
    }
};

export const refreshToken = async () => {
    try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token available');

        const response = await axios.post(`${API_URL}token/refresh/`, { refresh });
        localStorage.setItem('access_token', response.data.access);
        return response.data;
    } catch (error) {
        console.error('Token refresh error:', error.response?.data);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw error.response?.data || { detail: 'Session expired. Please log in again.' };
    }
};

export const getToken = () => {
    return localStorage.getItem('access_token');
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};