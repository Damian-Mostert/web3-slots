import axios from 'axios';


export const axiosDefault = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL+"/api/v1",
});


export default axiosDefault;
