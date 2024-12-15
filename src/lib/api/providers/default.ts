import axios from 'axios';


export const axiosDefault = axios.create({
    baseURL: "/api/v1",
});


export default axiosDefault;
