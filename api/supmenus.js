import { uniClientDB, db, dbCmd } from '@/utils/request'

const collection = db.collection('supmenus')

export function getSupmenusList (limit) {
	return uniClientDB({
		name: 'menus',
		command: collection
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

export function addSupmenu (data) {
	return uniClientDB({
		name: 'menus',
		command: collection.add(data)
	})
}

export function getSupmenu (id) {
	return uniClientDB({
		name: 'menus',
		command: collection.doc(id)
			.field({
				'uid': false,
				'create_time': false
			})
			.get()
	})
}

export function editSupmenu (id, data) {
	return uniClientDB({
		name: 'menus',
		command: collection.doc(id).update(data)
	})
}

export function deleteSupmenu (id) {
	return uniClientDB({
		name: 'menus',
		command: collection.doc(id).remove()
	})
}

export async function batchDeleteSupmenu (ids) {
	const errors = []
	for (let id of ids) {
		const res = await	uniClientDB({
			name: 'menus',
			command: collection.doc(id).remove()
		})
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}
