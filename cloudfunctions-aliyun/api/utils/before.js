const uniID = require('uni-id')

module.exports = {
	// 守卫拦截
	main: async (event) => {
		let {
			url,
			token
		} = event
		let json = {
			code: -1,
			msg: ''
		};
		if (url.indexOf('login/') == 0) {
			json.code = 0;
			json.msg = 'ok';
		} else {
			// 除login外，其他函数需要判断token
			var payload = await uniID.checkToken(token)
			if (payload.code && payload.code > 0) {
				return payload
			} else {
				json.code = 0;
				json.msg = 'ok';
			}
		}
		return json;
	}
}
