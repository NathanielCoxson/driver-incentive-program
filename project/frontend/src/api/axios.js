import axios from 'axios';
const BASE_URL = process.env.NODE_ENV === 'production' 
? 'http://34.225.199.196/api'
: 'http://localhost:3001/api'

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});