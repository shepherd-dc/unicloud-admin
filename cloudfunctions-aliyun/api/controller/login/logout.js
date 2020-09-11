const uniID = require('uni-id')
module.exports = {
	main: async (event) => {
		let {
			data,
			token,
			method
		} = event;
		try {
			const res = await uniID.logout(token)
			if (res.code === 0) {
				return res
			} else {
				throw res
			}
		} catch (err) {
			return {
				code: 505,
				msg: 'Token状态异常'
			}
		}
	}
}
