module.exports = function (payload, dbCmd) {
	return {
		submenus: {
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
							if (!args[0] || !args[0].name) {
								throw new Error('栏目名称不能为空')
							}
							args[0].status = 0
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
}
