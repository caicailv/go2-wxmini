import { http } from '@/utils/http'
export const wechatLoginApi = (data) => {
  return http({
    method: 'POST',
    url: '/wechat/login',
    data
  })
}

export const getUsersApi = (data) => {
  return http({
    method: 'POST',
    url: '/getUsers',
    data
  })
}
export const getUserInfoApi = (data) => {
  return http({
    method: 'POST',
    url: '/getUserInfo',
    data
  })
}

export const updateUserInfoApi = (data) => {
  return http({
    method: 'POST',
    url: '/updateUserInfo',
    data
  })
}
export const manageCreateUserApi = (data) => {
  return http({
    method: 'POST',
    url: '/manageCreateUser',
    data
  })
}

export const editMapApi = (data) => {
  return http({
    method: 'POST',
    url: '/editMap',
    data
  })
}

export const getMapListApi = (data) => {
  return http({
    method: 'POST',
    url: '/getMapList',
    data
  })
}

export const setLightMapApi = (data) => {
  return http({
    method: 'POST',
    url: '/setLightMap',
    data
  })
}

/* 

export const getMapList = (data) => {
  return service.get('/getMapList', data)
}
export const register = (data) => {
  return service.post('/register', data)
}
export const addMapApi = (data) => {
  return service.post('/addMap', data)
}
export const addMapRecord = (data) => {
  return service.post('/addMapRecord', data)
}
export const getMapRecordList = (data) => {
  return service.post('/getMapRecordList', data)
}
export const login = (data) => {
  return service.post('/login', data)
}

export const findInfo = (data) => {
  return service.post('/findInfo', data)
}
export const updateInfo = (data) => {
  return service.post('/updateInfo', data)
}


export const getUsers = (data) => {
  return service.post('/getUsers', data)
}

*/



