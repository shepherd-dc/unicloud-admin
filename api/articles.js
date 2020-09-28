import { uniClientDB, db, dbCmd } from '@/utils/request'

const name = 'articles'
const collection = db.collection('opendb-news-articles')

export function getAll () {
	return uniClientDB({
		name,
		command: collection.orderBy('sort', 'desc').get(),
	})
}

export function getArticlesCount () {
	return uniClientDB({
		name,
		command: collection.count(),
	})
}

export function addArticle (data) {
	return uniClientDB({
		name,
		command: collection.add(data)
	})
}

export function getArticle (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).get()
	})
}

export function editArticle (id, data) {
	return uniClientDB({
		name,
		command: collection.doc(id).update(data)
	})
}

export function aggregateArticlesList (limit, fromCollection = 'menus') {
	const search = {
		title: limit.search ? new RegExp(limit.search) : dbCmd.exists(true),
		category_id: limit.category_id || dbCmd.exists(true)
	}
	return uniClientDB({
		name,
		command: collection.aggregate()
			.lookup({
				from: fromCollection,
				localField: 'category_id',
				foreignField: '_id',
				as: fromCollection
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
			})
			.match(search)
			.sort({
				'is_sticky': -1,
				'sort': -1,
				'create_time': -1
			}),
		pagination: {
		  pageSize: limit.pageSize,
		  current: limit.page
		}
	})
}

export function deleteArticle (id) {
	return uniClientDB({
		name,
		command: collection.doc(id).remove()
	})
}

export async function batchDeleteArticle (ids) {
	const errors = []
	for (let id of ids) {
		const res = await	deleteArticle(id)
		if (+res.affectedDocs !== 1) {
			errors.push(res)
			break
		}
	}
	return errors
}
