<template>
	<div class="page">
		<Button type="default" @click="query">普通查询</Button>
		<Button type="default" @click="lodaPage">分页查询</Button>
	</div>
</template>
<script>
import db from '@/js_sdk/uni-clientDB/index.js'
const dbCmd = db.command
export default {
	methods: {
		query() {
			uniCloud.callFunction({
				name: 'uni-clientDB',
				data: {
					command: db.collection('list').where({
						name: new RegExp('龚', 'g'),
						time: dbCmd.gt(1105885393581)
					}).field({
						extra: false
					}).get()
				},
				success(res) {
					console.log(res);
					uni.showModal({
						content: JSON.stringify(res.result.data),
						showCancel: false
					})
				},
				fail(err) {
					console.error(err)
					uni.showModal({
						content: err.message || '云函数请求失败',
						showCancel: false
					})
				}
			})
		},
		lodaPage() {
			uniCloud.callFunction({
				name: 'uni-clientDB',
				data: {
					// 需要注意的是阿里云目前count方法有Bug，不传条件的情况下回报错
					command: db.collection('list').where({
						_id: dbCmd.exists(true)
					}).field({
						extra: false
					}),
					pagination: {
						pageSize: 5,
						current: 1,
					}
				},
				success(res) {
					console.log(res);
					uni.showModal({
						content: JSON.stringify(res.result.list),
						showCancel: false
					})
				},
				fail(err) {
					console.error(err)
					uni.showModal({
						content: err.message || '云函数请求失败',
						showCancel: false
					})
				}
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
