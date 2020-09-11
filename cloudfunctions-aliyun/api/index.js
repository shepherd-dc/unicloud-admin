'use strict';
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)

const before = require('./utils/before').main

exports.main = async (event, context) => {
	const { url, method, data, uniIdToken: token } = event // uniIdToken为uniID自动注入
	// 守卫拦截
	let result = await before({ url, token })
	if (result.code !== 0) {
		return result
	}
	// 加载业务函数
	let controller
	try {
		controller = require(resolve(`./controller/${url}`))
	} catch (err) {
		return {
			code: 404,
			msg: '请求错误: Request error',
		}
	}
	// 执行业务函数
	return await controller.main({
		data,
		token,
		method
	})
}
