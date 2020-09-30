module.exports = function (payload, dbCmd) {
	return {
		'opendb-news-articles': {
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
			// 不使用聚合时mixinCondition会在没有where的时候在collection方法之后插入where，
			// 有where时会跟where条件进行合并，取原条件且mixinCondition。
			// 使用聚合时会在第一阶段插入match使用混入的条件，如果有blockedField会插入在blockedField对应的project之前
			// mixinCondition: {
			// 	uid: payload.uid
			// }
		}
	}
}
