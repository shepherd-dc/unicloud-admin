'use strict';
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)

const before = require('./utils/before')

exports.main = async (event, context) => {
	let url = event.url;
	let data = event.data;
	let token = event.uniIdToken;
	let method = event.method;
	// 守卫拦截
	let json = await before.main({
		url,
		token
	});
	if (json.code != 0) {
		return json;
	}
	// 加载业务函数
	let controller;
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
	});
}
