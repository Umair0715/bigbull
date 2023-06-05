import axios from 'axios';

// export const baseURL = 'https://bigbull.immanuelkids.com';
export const baseURL = 'https://bigbullworld.com:3300';
// export const baseURL = 'http://localhost:3300';

const Axios = axios.create({ 
    baseURL : `${baseURL}/api`
});

export default Axios;