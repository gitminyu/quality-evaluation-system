import axios from "axios";
// import nProgress from "nprogress";
// import "nprogress/nprogress.css"

const requests = axios.create({
    baseURL: 'http://localhost:8082',
    timeout: 5000,
    withCredentials: true // 确保跨域请求时携带cookie
});

requests.interceptors.request.use((config) => {
    // nProgress.start();
    // 从localStorage中获取token
    const token = localStorage.getItem('token');
    // 如果token存在，则将其添加到请求头中
    if (token) {
        config.headers['Authorization'] = `Bearer_${token}`;
    }
    return config;
});

requests.interceptors.response.use((res) => {
    // nProgress.done();
    return res.data;
}, (error) => {
    console.log(error)
    return Promise.reject(new Error('failed'));
});

export default requests;
