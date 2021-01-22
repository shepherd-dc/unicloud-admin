import { uniClientDB, db, dbCmd } from '@/utils/request'

const name = 'user-list'
const collection = db.collection('uni-id-users')

export function aggregateUsersList (limit, fromCollection = 'uni-roles') {
	const search = {
		username: limit.search ? new RegExp(limit.search) : dbCmd.exists(true)
	}
	return uniClientDB({
		name,
		command: collection.aggregate()
			.lookup({
				from: fromCollection,
				localField: 'roles_id',
				foreignField: '_id',
				as: 'roles'
			})
			.project({
				uid: 0,
				[fromCollection + '._id']: 0,
				[fromCollection + '.uid']: 0,
				[fromCollection + '.icon']: 0,
				[fromCollection + '.status']: 0,
				[fromCollection + '.sort']: 0
			})
			// .match(search)
			.sort({
				'sort': -1,
				'create_time': 1
			}),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function getAll () {
	return uniClientDB({
		name,
		command: collection.orderBy('create_time', 'asc').orderBy('sort', 'desc').get(),
	})
}

export function getUsersCount () {
	return uniClientDB({
		name,
		command: collection.count(),
	})
}

export function addUser (data) {
	return uniClientDB({
		name,
		command: collection.add(data)
	})
}

export function getUser (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).get()
	})
}

export function editUser (id, data) {
	return uniClientDB({
		name,
		command: collection.doc(id).update(data)
	})
}

export function deleteUser (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).remove()
	})
}

export async function batchDeleteUser (ids) {
	const errors = []
	for (let id of ids) {
		const res = await	deleteUser(id)
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}
