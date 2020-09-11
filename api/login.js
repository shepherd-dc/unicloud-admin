import { 
	// uniID, 
	requestAPI 
} from '@/utils/request'

// 登录
export const login = async (params) => {
	// return await uniID('login', params)
	return requestAPI({
		url: 'login/index',
		data: params
	})
}

// 退出登录
export const logout = async (params) => {
	// return await uniID('logout', params)
	return requestAPI({
		url: 'login/logout',
		data: params
	})
}

// 获取用户信息
export const getAdminUserInfo = (data) => {
	return requestAPI({
		url: 'user/userInfo',
		data
	})
}
