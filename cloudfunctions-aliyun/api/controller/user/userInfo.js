const uniID = require('uni-id')
const db = uniCloud.database();

module.exports = {
	main: async (event) => {
		const {
			data,
			token,
			method
		} = event;
		const collection = db.collection('uni-id-users')
		const payload = await uniID.checkToken(token)
		const res = await collection.aggregate()
			// 关联权限表
			.lookup({
				from: 'uni-roles',
				localField: 'roles_id',
				foreignField: '_id',
				as: 'access'
			})
			// 判断权限状态
			.match({
				_id: payload.uid,
				status: 0,
				'access.status': 0
			})
			// 指定排除字段
			.project({
				password: 0,
				roles_id: 0,
				status: 0,
				token: 0,
				_id: 0
			})
			.end();
		const auth = res.data[0];
		if (!auth) {
			return {
				code: 404,
				msg: '您没有权限访问'
			}
		}
		return {
			msg: 'success',
			code: 0,
			data: res
		}
	},
}
