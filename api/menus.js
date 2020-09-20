import { uniClientDB, db, dbCmd } from '@/utils/request'

export function getAll (collection) {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).orderBy('sort', 'desc').get(),
	})
}

export function aggregateMenusList (limit, collection) {
	const search = {
		name: limit.search ? new RegExp(limit.search) : dbCmd.exists(true)
	}
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).aggregate()
			.lookup({
				from: 'supmenus',
				localField: 'sup_id',
				foreignField: '_id',
				as: 'supmenus'
			})
			.project({
				uid: 0,
				'supmenus._id': 0,
				'supmenus.uid': 0,
				'supmenus.icon': 0,
				'supmenus.status': 0,
				'supmenus.sort': 0,
				'supmenus.description': 0,
				'supmenus.create_time': 0,
			})
			.match(search)
			.sort({'sort': -1}),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function getMenusList (limit, collection='supmenus') {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection)
			.where({
				name: new RegExp(limit.search, 'g'),
			})
			.orderBy('sort', 'desc'),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function addMenu (data, collection='supmenus') {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).add(data)
	})
}

export function getMenu (id, collection='supmenus') {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).doc(id)
			.field({
				'uid': false,
				'create_time': false
			})
			.get()
	})
}

export function editMenu (id, data, collection='supmenus') {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).doc(id).update(data)
	})
}

export function deleteMenu (id, collection='supmenus') {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).doc(id).remove()
	})
}

export async function batchDeleteMenu (ids, collection='supmenus') {
	const errors = []
	for (let id of ids) {
		const res = await	uniClientDB({
			name: 'menus',
			command: db.collection(collection).doc(id).remove()
		})
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}
