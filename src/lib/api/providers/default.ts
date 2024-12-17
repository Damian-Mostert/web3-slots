import axios from 'axios';
import path from "path"

export const axiosDefault = axios.create({
    baseURL: path.join(String(process.env.NEXT_PUBLIC_APP_URL),"/api/v1"),
});


export default axiosDefault;
