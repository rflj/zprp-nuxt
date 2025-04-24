import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "http://rozgrywki.zprp.pl/api/",
});

export default axiosInstance;