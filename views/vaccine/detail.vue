<template>
  <div class="article-detail">
    <Card class="detail-card">
      <div class="title">{{ detail.name }}</div>
      <div class="info">
        <span class="author">喜虫育儿</span>
        <span class="time">{{ detail.create_time | datetime }}</span>
      </div>
      <div
        v-if="detail.avatar"
        class="avatar" >
        <img
          :src="detail.avatar"
          alt="avatar">
      </div>
      <div class="ql-snow">
        <custom-table>
          <table-item
            label="疫苗名称"
            text-align="center">{{ detail.name }}</table-item>
          <table-item
            label="疫苗类型"
            text-align="center">{{ detail.type }}</table-item>
          <table-item
            v-if="detail.type === '自费'"
            label="价格参考"
            text-align="center">{{ detail.price }}</table-item>
          <table-item
            label="接种时间"
            text-align="center">{{ detail.ages }}</table-item>
          <table-item
            label="接种说明"
            text-align="center">{{ detail.description }}</table-item>
          <table-item
            label="简介"
            text-align="center">{{ detail.introduction }}</table-item>
          <table-item
            label="接种禁忌"
            text-align="center">{{ detail.taboos }}</table-item>
          <table-item
            label="注意事项"
            text-align="center">{{ detail.precautions }}</table-item>
          <table-item
            label="接种反应"
            text-align="center">{{ detail.reactions }}</table-item>
          <table-item
            label="链接文章"
            text-align="center">
            <div
              v-for="(item, index) in detail.articles"
              :key="item._id"
              class="article">
              <span
                class="article-item"
                @click="toArticleDetail(item._id)">{{ (index + 1) + '. ' + item.title }}</span>
            </div>
          </table-item>
        </custom-table>
      </div>
    </Card>
  </div>
</template>

<script>
import { aggregateGetVaccine } from '@/api/vaccines'
import { formatDate } from '@/utils/tools'
import CustomTable from '@/components/custom-table/index'
import TableItem from '@/components/custom-table/TableItem'
export default {
  components: {
    CustomTable,
    TableItem
  },
  filters: {
	  datetime (value) {
	    if (!value) return ''
	    return formatDate(value)
	  }
  },
  data () {
    return {
      detail: {}
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.getVaccine()
  },
  methods: {
    async getVaccine () {
      const result = await aggregateGetVaccine(this.id)
      console.log('aggregateGetVaccine', result)
      result.type && (result.type = +result.type === 1 ? '自费' : '免费')
      this.detail = result
    },
    toArticleDetail (id) {
      console.log('article clicked', id)
      this.$router.push({
        name: 'articles/detail',
        query: { id }
      })
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
		.article-item {
			color: #2d8cf0;
			cursor: pointer;
			&:hover {
				color: #333;
				text-decoration: underline;
			}
		}
	}
	/deep/.ql-editor p {
		line-height: 2;
	}
</style>
