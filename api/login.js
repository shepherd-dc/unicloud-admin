import { uniID, callApi } from '@/utils/request'

// 登录
export const login = async (params) => {
	// return await uniID('login', params)
	return callApi({
		url: 'login/index',
		data: params
	})
}

// 获取用户信息
export const getAdminUserInfo = (data) => {
	return callApi({
		url: 'user/userInfo',
		data
	})
}

// 退出登录
export const logout = (data) => {
	return callApi({
		url: 'login/logout',
		data
	})
}
