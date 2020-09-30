module.exports = function (payload, dbCmd) {
	return {
		menus: {
			create: true,
			read: true,
			update: true,
			delete: true,
			// 是否允许使用聚合
			aggregate: true,
			// 是否允许使用联表查询，联表查询时blockedField不会对被连接的集合生效
			lookup: true,
			// 使用聚合时blockField不会覆盖客户端的project，而是在聚合第一阶段插入project
			// 不使用聚合时会在最后阶段插入一个field（会覆盖客户端的field方法）
			blockedField: ['extra'],
			// mixinCondition: {
			// 	uid: payload.uid
			// }
		}
	}
}
