'use strict';
const uniCurd = require('uni-curd')
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	if (!event.uniIdToken) {
		return {
			code: 403,
			msg: '缺少token'
		}
	}
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload && payload.code > 0) {
		return payload
	}
	try {
		const result = await uniCurd({
			command: event.command,
			pagination: event.pagination,
			rules: {
				todo: {
					create: true,
					read: true,
					update: true,
					delete: true,
					mixinCondition: {
						uid: payload.uid
					},
					hooks: {
						beforeSend({
							state,
							stage: {
								method,
								args
							},
							exec
						}) {
							switch (state.type) {
								case 'create':
									if (!args[0] || !args[0].title) {
										throw new Error('todo内容不能为空')
									}
									args[0].create_time = Date.now()
									args[0].uid = payload.uid
									break;
								case 'update':
									if (args[0].done) {
										args[0].done_time = Date.now()
									} else if(args[0].done === false) {
										args[0].done_time = dbCmd.remove()
									}
									break;
								default:
									break;
							}
						}
					}
				}
			}
		})
		return {
			code: 0,
			...result
		}

	} catch (e) {
		return {
			code: 500,
			msg: e.message
		}
	}
};
