import axios from 'axios';
import path from "path"

export const axiosDefault = axios.create({
    baseURL: path.join("/api/v1"),
});


export default axiosDefault;
