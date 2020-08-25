const uniID = require('uni-id')
module.exports = {
	main: async (event) => {
		let {
			data,
			token,
			method
		} = event;
		return await uniID.login({
			...data,
			queryField: ['username']
		});
	}
}
