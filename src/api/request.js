import axios from "axios";
// import nProgress from "nprogress";
// import "nprogress/nprogress.css"


const requests=axios.create({
    // 基础路径
    baseURL:'http://localhost:8082',
    // 请求超时的时间5s
    timeout:5000,
    
})
requests.interceptors.request.use((config)=>{
    // nProgress.start();
    // config:配置对象，里面的headers请求头属性很重要
    return config;
})
requests.interceptors.response.use((res)=>{
    // nProgress.done();
    return res.data;
},(error)=>{
    console.log(error)
    return Promise.reject(new Error('failed'));
})

export default requests;