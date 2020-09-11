const uniID = require('uni-id')
const noCheckAction = ['login']

function needsToken (url) {
	if (url.indexOf('/') >= 0) {
		url = url.split('/')[0]
	}
	if (noCheckAction.indexOf(url) < 0) {
		return true
	}
	return false
}

module.exports = {
	// 守卫拦截
	main: async (event) => {
		const { url, token } = event
		if (needsToken(url)) {
			if (!token) {
				return {
					code: 403,
					msg: '缺少token'
				}
			}
			const payload = await uniID.checkToken(token)
			if (payload.code && payload.code > 0) {
				return payload
			}
		}
		return {
			code: 0,
			msg: 'ok'
		}
	}
}
