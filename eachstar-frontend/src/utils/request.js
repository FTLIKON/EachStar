import axios from 'axios';

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";
// 创建axios, 赋给变量service
const service = axios.create({
	baseURL: BASEURL,
	timeout: 15000
});

// 添加请求拦截器
service.interceptors.request.use(function(config){
	// 在发送请求之前做些什么
	return config;
}, function(error){
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function(response){
	let data = response.data;
	if(data.resCode !== 0) {
		return Promise.reject(data);
	}
	
	// 对响应数据做点什么
	return response;
}, function(){
	// 对响应错误做点什么
	return Promise.reject(error);
});

export default service;
