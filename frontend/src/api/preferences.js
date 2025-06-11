import axios from 'axios';

const API_URL = 'http://localhost:8000/api/preferences/';

export async function getPreferences() {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return {
            username: response.data.username || '',
            email: response.data.email || '',
            ...response.data
        };
    } catch (error) {
        console.error('Get preferences error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to fetch preferences');
    }
}

export async function updatePreferences(data) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await axios.put(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update preferences error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to update preferences');
    }
}