const uniID = require('uni-id')
const db = uniCloud.database()
const _ = db.command
module.exports = {
	main: async (event) => {
		let {
			data,
			token,
			method
		} = event;
		const collection = db.collection('uni-id-users')
		switch (method) {
			// 查询角色列表
			case 'GET':
				var page = data.page ? data.page : 1,
					pageSize = data.pageSize ? data.pageSize : 100,
					search = {
						roles_id: data.rolesid ? data.rolesid : _.exists(true),
						username: data.username ? new RegExp(data.username) : _.exists(true)
					},
					total = (await collection.where(search).count()).total,
					res = (await collection.aggregate()
						.lookup({
							from: 'uni-roles',
							localField: 'roles_id',
							foreignField: '_id',
							as: 'roles'
						})
						.project({
							password: 0,
							// status: 0,
							token: 0,
							last_login_date: 0,
							last_login_ip: 0,
							register_date: 0,
							register_ip: 0,
							'roles._id': 0,
							'roles.node': 0,
							'roles.status': 0
						})
						.match(search)
						.skip((page - 1) * pageSize)
						.limit(pageSize)
						.end()).data;
				return {
					code: 0,
					msg: 'success',
					data: {
						total,
						page,
						pageSize,
						data: res
					}
				}
			case 'GETONE':
				var res = (await collection.doc(data.id).get()).data[0]
				return {
					code: 0,
					msg: 'success',
					data: res
				}
				// 添加角色
			case 'POST':
				if (data._id) {
					delete data._id;
				}
				data.password = uniID.encryptPwd(data.password)
				await collection.add(data);
				return {
					code: 0,
					msg: 'success'
				}
			case 'EDIT':
				var id = data._id
				delete data._id;
				var res = await collection.doc(id).get();
				if (uniID.encryptPwd(data.password) != res.data[0].password) {
					data.password = uniID.encryptPwd(data.password)
				}
				await collection.doc(id).update(data);
				return {
					code: 0,
					msg: 'success'
				}
			case 'DELETE':
				await collection.doc(data.id).remove();
				return {
					code: 0,
					msg: 'success'
				}
			case 'BATCHDELETE':
				for (var item of data.ids) {
					await collection.doc(item).remove();
				}
				return {
					code: 0,
					msg: 'success'
				}
			default:
				return {
					code: 404,
					msg: '请求方式错误: Request mode error'
				}
		}
	}
}
