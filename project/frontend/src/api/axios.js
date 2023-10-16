import axios from 'axios';

export default axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'http://34.225.199.196/api'
        : 'http://localhost:3001/api'
});