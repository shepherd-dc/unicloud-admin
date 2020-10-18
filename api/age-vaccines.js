import { uniClientDB, db, dbCmd } from '@/utils/request'

const name = 'age-vaccines'
const collection = db.collection('age-vaccines')

export function getVaccineList (limit) {
	return uniClientDB({
		name,
		command: collection.where({
			name: new RegExp(limit.search, 'g'),
		}),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function addVaccine (data) {
	return uniClientDB({
		name,
		command: collection.add(data)
	})
}

export function getVaccine (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).get()
	})
}

export function editVaccine (id, data) {
	return uniClientDB({
		name,
		command: collection.doc(id).update(data)
	})
}

export function deleteVaccine (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).remove()
	})
}

export async function batchDeleteVaccine (ids) {
	const errors = []
	for (let id of ids) {
		const res = await	deleteVaccine(id)
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}

export function aggregateVaccineList (limit, fromCollection = 'ages') {
	const search = {
		name: limit.search ? new RegExp(limit.search) : dbCmd.exists(true),
		age_id: limit.age_id || dbCmd.exists(true),
		type: limit.type !== undefined ? limit.type : dbCmd.exists(true)
	}
	return uniClientDB({
		name,
		command: collection.aggregate()
			.lookup({
				from: fromCollection,
				localField: 'age_id',
				foreignField: '_id',
				as: fromCollection
			})
			.project({
				uid: 0,
				[fromCollection + '._id']: 0,
				[fromCollection + '.uid']: 0,
				[fromCollection + '.status']: 0,
				[fromCollection + '.sort']: 0,
				[fromCollection + '.create_time']: 0,
			})
			.match(search)
			.sort({
				[fromCollection + '.month']: 1,
				'sort': -1,
				'create_time': -1
			}),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}
