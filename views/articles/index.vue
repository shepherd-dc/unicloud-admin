<template>
  <Card dis-hover>
    <Button
      class="top"
      type="primary"
      @click="addedit('add')">发布文章</Button>
    <Button
      class="top"
      type="error"
      @click="batchDel">批量删除</Button>
    <Tooltip
      content="刷新"
      placement="right">
      <Button
        class="top"
        type="primary"
        shape="circle"
        icon="md-refresh"
        @click="getList" /></Tooltip>
		<Input
			v-model="limit.search"
			class="top inpt"
			search
			suffix="ios-search"
			placeholder="文章标题"
			@on-search="getList"
			@on-change="getList" />
    <Select
    	ref="resetSelect"
			class="top inpt"
      v-model="limit.category_id"
			@on-change="selectFilter"
    	placeholder="请选择栏目"
      clearable>
    	<OptionGroup
    		v-for="sup in menusList"
    		:key="sup._id"
    		:label="sup.name">
    		<Option
        v-for="item in sup.menus"
        :value="item._id"
        :key="item._id">{{ item.name }}</Option>
    	</OptionGroup>
    </Select>
    <Table
      :loading="loading"
      :columns="columns"
      :data="list"
      border
      @on-selection-change="selectionChange">
			<template
			  slot="title"
			  slot-scope="{ row, index }">
			  <Tooltip
			    content="点击查看详情"
			    placement="right">
			    <span
			      style="color: #2d8cf0; cursor: pointer;"
			      @click="toDetail(row._id)">
						{{ row.title }}
					</span>
			  </Tooltip>
			</template>
      <template
        slot="action"
        slot-scope="{ row, index }">
        <Tooltip
          content="编辑"
          placement="left">
          <Button
            style="margin-top: 4px; margin-right: 5px;"
            type="primary"
            shape="circle"
            icon="ios-create"
            @click="addedit(row._id)" />
        </Tooltip>
        <Button
          style="margin-top: 4px;"
          type="error"
          shape="circle"
          icon="ios-trash"
          @click="del(row._id)" />
      </template>
    </Table>
    <div class="page">
      <Page
        :total="limit.total"
        :page-size-opts="limit.pageSizeOpts"
        :current="limit.page"
        :page-size="limit.pageSize"
        show-total
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </div>
  </Card>
</template>

<script>
import { aggregateGetAll } from '@/api/menus'
import { aggregateArticlesList, deleteArticle, batchDeleteArticle } from '@/api/articles'
import { formatDate } from '@/utils/tools'
export default {
  data () {
    return {
      indeterminate: false,
      loading: false,
      ids: [],
      limit: {
        search: '',
				category_id: '',
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizeOpts: [10, 50, 100, 500, 1000]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
				  title: '标题',
				  key: 'title',
				  align: 'left',
					slot: 'title'
					// render: (h, res) => {
					//   return h('span', {
					// 			style: {
					// 				color: '#2d8cf0',
					// 				cursor: 'pointer'
					// 			}
					// 		},
					// 		res.row.title
					// 	)
					// }
        },
        {
          title: '栏目名称',
          key: 'menu_name',
          align: 'center',
					width: '120px',
        },
        {
				  title: '摘要',
				  key: 'excerpt',
				  align: 'left'
        },
				{
				  title: '状态',
				  key: 'status',
				  align: 'center',
				  width: '100px',
				  render: (h, res) => {
				    return h('Tag', {
								attrs: {
									color: res.row.status === 1 ? 'success': 'primary'
								}
							},
							res.row.status === 1 ? '发布' : '草稿'
						)
				  }
				},
				{
				  title: '置顶',
				  key: 'is_sticky',
				  align: 'center',
				  width: '100px',
				  sortable: true,
					render: (h, res) => {
					  return h('Tag', {
								attrs: {
									color: res.row.is_sticky === 1 ? 'warning': 'default'
								}
							},
							res.row.is_sticky === 1 ? '是' : '否'
						)
					}
				},
				{
				  title: '排序',
				  key: 'sort',
				  align: 'center',
				  width: '100px',
				  sortable: true
				},
				{
				  title: '发布时间',
				  key: 'create_time',
				  align: 'center',
				  width: '120px',
				  sortable: true,
				  render: (h, res) => {
				    const create_time = formatDate(res.row.create_time)
				    return h('span', create_time)
				  }
				},
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      list: [],
			menusList: []
		}
  },
  async mounted () {
    this.getList()
		this.getMenusList()
  },
  methods: {
    // 全选
    selectionChange (e) {
      this.ids = e.map(function (item) {
        return item['_id']
      })
    },
    // 切换页码
    pageChange (e) {
      this.limit.page = e
      this.getList()
    },
    // 切换条数
    pageSizeChange (e) {
      this.limit.pageSize = e
      this.getList()
    },
		// 栏目筛选
		selectFilter (e) {
			this.limit.category_id = e
			this.getList()
		},
    // 获取列表
    async getList () {
      this.loading = true
      const res = await aggregateArticlesList(this.limit)
      const { list, total } = res
			console.log('aggregateArticlesList', res)
      this.limit.total = total
      this.list = list.map(item => {
        item.menu_name = item.menus.length ? item.menus[0].name : ''
        Reflect.deleteProperty(item, 'menus')
        return item
      })
      console.log(this.list)
      this.loading = false
    },
		// 获取栏目列表
		async getMenusList () {
		  const res = await aggregateGetAll('supmenus')
		  console.log('aggregateGetAll', res)
		  const { data } = res
		  this.menusList = data
		},
    // 新增或编辑跳转
    async addedit (action) {
			let title
			let id
      if (action === 'add') {
        title = '新增文章'
      } else {
        title = '编辑文章'
        id = action // action = _id
      }
			this.$router.push({
				name: 'articles/edit',
				params: { title },
				query: { id }
			})
    },
		// 跳转详情页
		toDetail (id) {
			this.$router.push({
				name: 'articles/detail',
				query: { id }
			})
		},
    // 删除
    async del (id) {
		  this.$Modal.confirm({
		    title: '提示信息',
		    content: '是否删除?',
		    onOk: async () => {
		      await deleteArticle(id)
		      this.$Message.success('删除成功')
		      this.getList()
		    }
		  })
    },
    // 批量删除
    async batchDel () {
		  if (this.ids.length > 0) {
		    this.$Modal.confirm({
		      title: '提示信息',
		      content: '是否删除这些?',
		      onOk: async () => {
		        const errs = await batchDeleteArticle(this.ids)
		        if (!errs.length) {
		          this.$Message.success('删除成功')
		        } else {
		          this.$Message.error('出错啦')
		        }
            this.limit.page = 1
		        this.getList()
		      }
		    })
		  } else {
		    this.$Message.error('请选择要删除的数据')
		  }
    }
  }
}
</script>

<style lang="less" scoped>
.top {
	margin: 0 20px 20px 0;
}
.inpt {
	float: right;
	width: 200px;
	margin-left: 20px;
	margin-right: 0;
}
.page {
	width: 100%;
	text-align: center;
	margin-top: 30px;
}

/deep/ .ivu-input-type-textarea .ivu-input {
	resize: none;
	font-family: 'MicroSoft YaHei';
}
/deep/ .ivu-input-type-textarea .ivu-input-word-count {
	bottom: 6px;
}
/deep/ .ivu-upload .ivu-upload-input {
  display: none;
}
</style>
