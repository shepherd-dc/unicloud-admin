import { uniClientDB, db, dbCmd } from '@/utils/request'

export function getAll (collection) {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).orderBy('sort', 'desc').get(),
	})
}

export function aggregateGetAll (collection = 'supmenus') {
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).aggregate()
			.lookup({
				from: 'menus',
				localField: '_id',
				foreignField: 'sup_id',
				as: 'menus'
			})
			.project({
				_id: 1,
				name: 1,
				'menus._id': 1,
				'menus.sup_id': 1,
				'menus.name': 1,
			})
			.sort({'sort': -1})
			.end()
	})
}

export function aggregateMenusList (limit, collection, fromCollection) {
	const search = {
		name: limit.search ? new RegExp(limit.search) : dbCmd.exists(true)
	}
	return uniClientDB({
		name: 'menus',
		command: db.collection(collection).aggregate()
			.lookup({
				from: fromCollection,
				localField: 'sup_id',
				foreignField: '_id',
				as: fromCollection
			})
			.lookup({
				from: 'opendb-news-articles',
				localField: '_id',
				foreignField: 'category_id',
				as: 'articles'
			})
			.project({
				uid: 0,
				[fromCollection + '._id']: 0,
				[fromCollection + '.uid']: 0,
				[fromCollection + '.icon']: 0,
				[fromCollection + '.status']: 0,
				[fromCollection + '.sort']: 0,
				[fromCollection + '.description']: 0,
				[fromCollection + '.create_time']: 0,
				'articles.avatar': 0,
				'articles.content': 0,
				'articles.excerpt': 0,
				'articles.create_time': 0,
				'articles.is_sticky': 0,
				'articles.sort': 0
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
		const res = await	deleteMenu(id, collection)
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}
