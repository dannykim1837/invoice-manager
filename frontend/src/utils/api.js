import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function deleteItem(url) {
    try {
        await axios.delete(url, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return true;
    } catch (err) {
        return false;
    }
}

export { api };