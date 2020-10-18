import { uniClientDB, db, dbCmd } from '@/utils/request'

const name = 'vaccines'
const collection = db.collection('vaccines')

export function getVaccinesAll () {
	return uniClientDB({
		name,
		command: collection.orderBy('sort', 'desc').orderBy('create_time', 'asc').get()
	})
}

export function getVaccinesList (limit) {
	return uniClientDB({
		name,
		command: collection.where(dbCmd.and(
			{
				name: new RegExp(limit.search, 'g')
			},
			{
				type: limit.type
			})
		)
		.orderBy('sort', 'desc'),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function deleteFields (id, fields) {
	const data = {}
	fields.forEach(f => {
		data[f] = dbCmd.remove()
	})
	console.log('fields', data)
	return uniClientDB({
		name,
		command: collection.doc(id).update(data)
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

export async function aggregateGetVaccine (id) {
	let result = {}
	if (!id) return result
	let links = []
	let articles = []
	const detail = await getVaccine(id)
	const { data: detailData } = detail
	if (detailData.length) {
		const detail = detailData[0]
		links = detail.links || []
		result = Object.assign({}, detail)
	}
	const articlesResult = await uniClientDB({
		name: 'articles',
		command: db.collection('opendb-news-articles').where({
			_id: dbCmd.in(links)
		}).get()
	})
	const { data: articlesData } = articlesResult
	if (articlesData.length) {
		articles = articlesData
	}
	result.articles = articles
	return result
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

export async function batchDeleteVaccines (ids) {
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

export function aggregateVaccinesList (limit, fromCollection = 'opendb-news-articles') {
	const search = {
		name: limit.search ? new RegExp(limit.search) : dbCmd.exists(true),
		type: limit.type !== undefined ? limit.type : dbCmd.exists(true)
	}
	return uniClientDB({
		name,
		command: collection.aggregate()
			.lookup({
				from: fromCollection,
				localField: 'links',
				foreignField: '_id',
				as: 'articles'
			})
			.project({
				uid: 0,
				'articles.uid': 0,
				'articles.status': 0,
				'articles.sort': 0,
				'articles.create_time': 0,
				'articles.update_time': 0,
				'articles.is_sticky': 0,
				'articles.avatar': 0,
				'articles.content': 0,
				'articles.excerpt': 0,
			})
			.match(search)
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
