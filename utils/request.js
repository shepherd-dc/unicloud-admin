import {
	Message
} from 'view-design';
import store from '../store';
import router from '@/router'
import db from '@/js_sdk/uni-clientDB/index.js'
const dbCmd = db.command

const $uniCloud = async (name, data) => {
  uni.showLoading()
  try {
		// const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name, // 云函数名字
			data
      // data: Object.assign({}, data, { token }) // 传输数据
    })
    return res.result
  } catch (e) {
    return e
  } finally {
    uni.hideLoading()
  }
}

export const uniID = async (action, params = {}) => {
  uni.showLoading()
  try {
		// const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name: 'user-center', // 云函数名字
			data: {
				action,
				params
			},
    })
    return res.result
  } catch (e) {
    return e
  } finally {
    uni.hideLoading()
  }
}

export const uniClientDB = async ({command, pagination}) => {
  uni.showLoading()
  try {
    const res = await uniCloud.callFunction({
      name: 'uni-clientDB', // 云函数名字
			data: {
				command,
				pagination
			},
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

export function callApi(obj) {
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: 'api',
			data: {
				url: obj.url,
				method: obj.method,
				data: obj.data
			},
			success(res) {
				var data = res.result
				if (data.code === 0) {
					if (data.token) {
						resolve(data)
					} else {
						resolve(data.data)
					}
				} else if (data.code === 1302) {
					store.dispatch('handleLogOut')
				} else if (data.code === 505) {
					store.commit('setUid', '')
					store.commit('setToken', '')
					store.commit('setHasGetInfo', '')
					router.replace({
						name: 'login'
					});
					Message.error({
						background: true,
						content: data.msg
					})
				} else {
					Message.error({
						background: true,
						content: data.msg
					})
					reject()
				}
			},
			fail(error) {
				reject(Message.error('服务器异常'))
			}
		})
	})
}

export default $uniCloud

export {
	db,
	dbCmd
}
