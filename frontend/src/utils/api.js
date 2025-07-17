import axios from 'axios';
import { getToken } from './auth';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Automatically add Authorization header
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Generic delete (기존 코드 그대로 유지)
export async function deleteItem(url) {
    try {
        await axios.delete(url, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return true;
    } catch (err) {
        return false;
    }
}

// 새로 만든 axiosInstance도 함께 export
export default axiosInstance;
