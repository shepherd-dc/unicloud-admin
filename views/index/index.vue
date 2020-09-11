<template>
	<div class="page">
		<Button type="default" @click="query">普通查询</Button>
		<Button type="default" @click="lodaPage">分页查询</Button>
		<Button type="default" @click="loginQuery">授权查询</Button>
	</div>
</template>
<script>
import { uniClientDB, db, dbCmd } from '@/utils/request'
export default {
	methods: {
		async query() {
			const res = await uniClientDB({
				command: db.collection('list').where({
					name: new RegExp('龚', 'g'),
					time: dbCmd.gt(1105885393581)
				}).field({
					extra: false
				}).get()
			})
			console.log(res);
			uni.showModal({
				content: JSON.stringify(res.data),
				showCancel: false
			})
		},
		async lodaPage() {
			const res = await uniClientDB({
				command: db.collection('list').where({
					_id: dbCmd.exists(true)
				}).field({
					extra: false
				}),
				pagination: {
					pageSize: 5,
					current: 1,
				}
			})
			console.log(res);
			uni.showModal({
				content: JSON.stringify(res.list),
				showCancel: false
			})
		},
		async loginQuery() {
			const res = await uniClientDB({
				name: 'authorized',
				command: db.collection('todo').get()
			})
			console.log(res);
			uni.showModal({
				content: JSON.stringify(res.data),
				showCancel: false
			})
		}
	}
}
</script>
<style>
.page {
	background-image: url(../../assets/images/sy.jpg);
	background-size: 100%;
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin: 0;
	padding: 0;
}
</style>
