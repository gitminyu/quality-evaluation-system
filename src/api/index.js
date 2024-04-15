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
    url:`/getVerifyCode?${new Date().getTime()}`,
    method: 'get',
    data: data
})
export const getCal=(data)=>requests({
    url:'/getCal',
    method: 'get',
    data: data
})
export const getEvaluationItem=(data)=>requests({
    url:'/item/getAll',
    method:'post',
    data: data
})
export const getDictionary=(data)=>requests({
    url:'/dictionary',
    method:'post',
    data: data
});
export const getSystemList=(data)=>requests({
    url:'/system/get',
    method:'post',
    data: data
})
export const deleteSystemById=(data)=>requests({
    url:'/system/deleteSystemById',
    method:'post',
    data: data
})
export const updateSystem=(data)=>requests({
    url:'/system/updateSystem',
    method:'post',
    data: data
})