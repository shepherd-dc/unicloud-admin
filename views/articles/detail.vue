<template>
  <div>文章详情
		<h3>{{ detail.title }}</h3>
	</div>
</template>

<script>
import { getArticle } from '@/api/articles'
export default {
	data() {
		return {
			detail: {}
		}
	},
	mounted () {
		this.getArticle()
	},
	computed: {
		id () {
			return this.$route.query.id
		}
	},
	methods: {
		async getArticle () {
			const res = await getArticle(this.id)
			const { data } = res
			if (data.length) {
				this.detail = data[0]
				console.log(this.detail)
			}
		}
	}
}
</script>

<style lang="less" scoped>
</style>
