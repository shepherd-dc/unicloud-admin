<template>
  <div class="article-detail">
		<Card class="detail-card">
			<div class="title">{{ detail.title }}</div>
			<div class="info">
				<span class="author">喜虫育儿</span>
				<span class="time">{{ detail.create_time | datetime }}</span>
			</div>
			<div
				v-if="detail.avatar"
				class="avatar" >
				<img :src="detail.avatar" alt="avatar">
			</div>
			<div class="ql-snow">
				<div class="ql-editor" v-html="detail.content"></div>
			</div>
		</Card>
	</div>
</template>

<script>
import { getArticle } from '@/api/articles'
import { formatDate } from '@/utils/tools'
export default {
	data() {
		return {
			detail: {}
		}
	},
	mounted () {
		this.getArticle()
	},
	filters: {
	  datetime (value) {
	    if (!value) return ''
	    return formatDate(value)
	  }
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
	.article-detail {
		p {
			line-height: 1.5;
		}
		.detail-card {
			padding: 20px;
		}
		.title {
			font-size: 18px;
			font-weight: bold;
			text-align: center;
			margin-bottom: 10px;
			padding-bottom: 8px;
			border-bottom: 1px solid #F2F2F2;
		}
		.info {
			text-align: center;
			margin-bottom: 20px;
			.author {
				margin-right: 20px;
			}
		}
	}
	/deep/.ql-editor p {
		line-height: 2;
	}
</style>
