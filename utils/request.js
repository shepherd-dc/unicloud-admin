import { Message } from 'view-design'
import store from '../store'
import router from '@/router'

import db from '@/js_sdk/uni-clientDB/index.js'
const dbCmd = db.command

const uniClientDB = async ({ name = 'uni-clientDB', command, pagination }) => {
  uni.showLoading()
  try {
    const res = await uniCloud.callFunction({
      name,
			data: {
				command,
				pagination
			},
    })
    return res.result
  } catch (e) {
		console.error(e) // eslint-disable-line
		Message.error({
			background: true,
			content: e.message || '云函数请求失败',
		})
  } finally {
    uni.hideLoading()
  }
}

const uniID = async (action, params = {}) => {
  uni.showLoading()
  try {
		// const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name: 'user-center',
			data: {
				action,
				params
			},
    })
    return res.result
  } catch (e) {
    console.error(e) // eslint-disable-line
    Message.error({
    	background: true,
    	content: e.message || '云函数请求失败',
    })
  } finally {
    uni.hideLoading()
  }
}

const requestAPI = async ({ url, method, data }) => {
  uni.showLoading()
  try {
    const res = await uniCloud.callFunction({
      name: 'api',
			data: {
				url,
				method,
				data
			},
    })
    const { result } = res
    if (result.code === 0) {
    	if (result.token) {
    		return result
    	} else {
    		return result.data
    	}
    } else if (result.code === 403 || result.code === 505) {
    	store.commit('setUid', '')
    	store.commit('setToken', '')
    	store.commit('setHasGetInfo', false)
    	router.replace({
    		name: 'login'
    	});
    	Message.error({
    		background: true,
    		content: result.msg
    	})
    } else {
    	Message.error({
    		background: true,
    		content: result.msg
    	})
    }
  } catch (e) {
    console.error(e) // eslint-disable-line
		Message.error({
			background: true,
			content: e.message || '云函数请求失败',
		})
  } finally {
    uni.hideLoading()
  }
}

export default async (name, data) => {
  uni.showLoading()
  try {
		// const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name, // 云函数名字
			// data: Object.assign({}, data, { token }) // 传输数据
			data
    })
    return res.result
  } catch (e) {
    console.error(e) // eslint-disable-line
    uni.showModal({
    	content: e.message || '云函数请求失败',
    	showCancel: false
    })
  } finally {
    uni.hideLoading()
  }
}

export {
	requestAPI,
	uniID,
	uniClientDB,
	db,
	dbCmd
}
