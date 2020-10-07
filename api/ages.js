import { uniClientDB, db, dbCmd } from '@/utils/request'

const name = 'vaccine'
const collection = db.collection('ages')

export function getAgesAll () {
	return uniClientDB({
		name,
		command: collection.orderBy('month', 'asc').get()
	})
}

export function getAgesList (limit) {
	return uniClientDB({
		name,
		command: collection.where(dbCmd.or(
				{
					month_name: new RegExp(limit.search, 'g'),
				},
				{
					age_name: new RegExp(limit.search, 'g'),
				})
			)
			.orderBy('month', 'asc'),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function addAge (data) {
	return uniClientDB({
		name,
		command: collection.add(data)
	})
}

export function getAge (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).get()
	})
}

export function editAge (id, data) {
	return uniClientDB({
		name,
		command: collection.doc(id).update(data)
	})
}

export function deleteAge (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).remove()
	})
}

export async function batchDeleteAge (ids) {
	const errors = []
	for (let id of ids) {
		const res = await	deleteAge(id)
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}
