import axios from 'axios';
import config from '../../config.jsx'

const BASE_URL = config.API;

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
