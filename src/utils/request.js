import axios from 'axios'

//创建一个axios对象
//这个创建出来的对象其实与axios基本一致
//创建出来的对象可以设置一些统一的设置
// baseURL
let myRequest = axios.create({
    baseURL: 'http://localhost:8080'
})

//axios添加请求拦截器
myRequest.interceptors.request.use((config) => {
    return config;
}, function (error) {
    return Promise.reject(error);
});

//axios添加响应拦截器
myRequest.interceptors.response.use((response) => {
    //对响应的内容进行过滤处理
    return response.data
}, function (error) {
    return Promise.reject(error);
});


export default myRequest