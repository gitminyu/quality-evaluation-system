import requests from "./request";
export const login=(data)=>requests({
    url:'/user/login',
    method: 'post',
    data: data
})
export const register=(data)=>requests({
    url:'/user/register',
    method: 'post',
    data: data
})
export const getVerifyCode=(data)=>requests({
    url:'/getVerifyCode',
    method: 'get',
    data: data
})
export const getCal=(data)=>requests({
    url:'/getCal',
    method: 'get',
    data: data
})