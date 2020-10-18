<template>
  <Card>
    <Button
      class="top"
      type="primary"
      @click="addedit('add')">添加疫苗</Button>
    <Button
      class="top"
      type="error"
      @click="batchDel">批量删除</Button>
    <Tooltip
      content="刷新"
      placement="right"><Button
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
      placeholder="疫苗名称"
      @on-search="getList"
      @on-change="getList" />
		<Select
			class="top inpt"
		  v-model="limit.type"
			@on-change="typeSelectFilter"
			placeholder="请选择免费/自费"
		  clearable>
		  <Option
		    v-for="item in typeList"
		    :value="item.id"
		    :key="item.id">{{ item.name }}</Option>
		</Select>
    <Table
      :loading="loading"
      :columns="columns"
      :data="list"
      border
      @on-selection-change="selectionChange">
      <template
        slot="action"
        slot-scope="{ row, index }">
        <Tooltip
          content="编辑"
          placement="left">
          <Button
            style="margin-top: 4px;margin-right: 5px;"
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
    <Modal
      v-model="show"
			width="600px"
      :title="showtitle"
      @on-cancel="cancel">
      <Form
        ref="vaccine"
        :model="vaccine"
        :rules="rules"
        :label-width="80">
        <FormItem
          prop="name"
          label="疫苗名称">
          <Input
            v-model="vaccine.name"
            placeholder="请输入疫苗名称"
            clearable />
        </FormItem>
				<FormItem
					prop="type"
				  label="疫苗类型">
				  <Select
				  	ref="resetSelect"
				    v-model="vaccine.type"
				    clearable>
				    <Option
				      v-for="item in typeList"
				      :value="item.id"
				      :key="item.id">{{ item.name }}</Option>
				  </Select>
				</FormItem>
				<FormItem
				  label="接种时间">
				  <Input
				    v-model="vaccine.ages"
				    placeholder="请输入接种时间"
						clearable />
				</FormItem>
				<FormItem
				  label="接种次数">
				  <Input
				    v-model="vaccine.times"
				    placeholder="请输入接种次数"
						clearable />
				</FormItem>
				<FormItem
				  label="说明">
				  <Input
				    v-model="vaccine.description"
				    :autosize="{minRows: 2, maxRows: 5}"
				    type="textarea"
				    maxlength="25"
				    show-word-limit
				    placeholder="请输入说明" />
				</FormItem>
				<FormItem
				  label="小贴士">
				  <Input
				    v-model="vaccine.tips"
				    :autosize="{minRows: 2, maxRows: 5}"
				    type="textarea"
				    maxlength="25"
				    show-word-limit
				    placeholder="请输入小贴士" />
				</FormItem>
				<FormItem
				  label="简介">
				  <Input
				    v-model="vaccine.introduction"
				    :autosize="{minRows: 2, maxRows: 10}"
				    type="textarea"
				    maxlength="500"
				    show-word-limit
				    placeholder="请输入简介" />
				</FormItem>
				<FormItem
				  label="接种禁忌">
				  <Input
				    v-model="vaccine.taboos"
				    :autosize="{minRows: 2, maxRows: 10}"
				    type="textarea"
				    maxlength="500"
				    show-word-limit
				    placeholder="请输入接种禁忌" />
				</FormItem>
				<FormItem
				  label="注意事项">
				  <Input
				    v-model="vaccine.precautions"
				    :autosize="{minRows: 2, maxRows: 10}"
				    type="textarea"
				    maxlength="500"
				    show-word-limit
				    placeholder="请输入注意事项" />
				</FormItem>
				<FormItem
				  label="接种反应">
				  <Input
				    v-model="vaccine.reactions"
				    :autosize="{minRows: 2, maxRows: 10}"
				    type="textarea"
				    maxlength="500"
				    show-word-limit
				    placeholder="请输入接种反应" />
				</FormItem>
				<FormItem
				  label="链接文章">
				  <Select
						ref="resetSelect1"
				    v-model="vaccine.links"
						placeholder="请选择链接文章（多选）"
						multiple
				    clearable>
				    <Option
				      v-for="item in articlesList"
				      :value="item._id"
				      :key="item._id">{{ item.title }}</Option>
				  </Select>
				</FormItem>
        <FormItem
          label="排序">
          <InputNumber
            :max="20"
            :min="0"
            v-model="vaccine.sort"></InputNumber>
        </FormItem>
        <FormItem
          label="状态"
          prop="status">
          <i-switch
            v-model="vaccine.status"
            size="large">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
				<Button
					type="default"
					style="margin-right: 10px;"
					size="large"
					@click="reset">重置</Button>
				<Button
					:loading="modal_loading"
					type="primary"
					size="large"
					@click="confirm('vaccine')">确定</Button>
				</div>
    </Modal>
  </Card>
</template>

<script>
import { getVaccinesAll, deleteFields, getVaccinesList, aggregateVaccinesList, addVaccine, getVaccine, editVaccine, deleteVaccine, batchDeleteVaccines } from '@/api/vaccines'
import { getAll } from '@/api/articles'
export default {
  data () {
    return {
      indeterminate: false,
      loading: false,
      show: false,
      showtitle: '',
      modal_loading: false,
      ids: [],
      limit: {
        search: '',
				type: undefined,
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
				  title: '疫苗名称',
				  key: 'name',
				  align: 'left',
					render: (h, res) => {
					  const name = res.row.name
						const id = res.row._id
					  return h('span', {
								style: {
									color: '#2d8cf0'
								},
								class: {
									links: true
								},
								on: {
									click: () => {
										this.toVaccineDetail(id)
									}
								}
							}, name
						)
					}
				},
				{
				  title: '类型',
				  key: 'type',
				  align: 'center',
					width: '100px',
				  render: (h, res) => {
						return h('Tag', {
								attrs: {
									color: res.row.type === 0 ? 'success': 'error'
								}
							},
							res.row.type === 0 ? '免费' : '自费'
						)
				  }
				},
				// {
				//   title: '接种次数',
				//   key: 'times',
				//   align: 'center'
				// },
				{
				  title: '接种时间',
				  key: 'ages',
				  align: 'left',
					width: '140px'
				},
				{
				  title: '说明',
				  key: 'description',
				  align: 'left',
					width: '140px'
				},
				// {
				//   title: '小贴士',
				//   key: 'tips',
				//   align: 'left'
				// },
				// {
				//   title: '简介',
				//   key: 'introduction',
				//   align: 'left',
				// 	width: '200px'
				// },
				// {
				//   title: '接种禁忌',
				//   key: 'taboos',
				//   align: 'left',
				// 	width: '200px'
				// },
				// {
				//   title: '注意事项',
				//   key: 'precautions',
				//   align: 'left',
				// 	width: '200px'
				// },
				// {
				//   title: '接种反应',
				//   key: 'reactions',
				//   align: 'left',
				// 	width: '200px'
				// },
				{
				  title: '链接文章',
				  key: 'links',
				  align: 'left',
					width: '280px',
					render: (h, res) => {
						const articles = res.row.articles
						return h('div', articles.map((a, i) => {
							return h('div', {
								style: {
									color: '#2d8cf0'
								},
								class: {
									links: true
								},
								on: {
									click: () => {
										this.toArticleDetail(a._id)
									}
								}
							}, `${i + 1}. ${a.title}`)
						}))
					}
				},
				// {
				//   title: '排序',
				//   key: 'sort',
				//   align: 'center',
				//   width: '100px',
				//   sortable: true
				//   },
				// {
				// 	title: '状态',
				// 	key: 'status',
				// 	align: 'center',
				// 	render: (h, res) => {
				// 		return h('Tag', {
				// 				attrs: {
				// 					color: res.row.status === 0 ? 'success': 'error'
				// 				}
				// 			},
				// 			res.row.status === 0 ? '正常' : '禁用'
				// 		)
				// 	}
				// },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
					width: '120px'
        }
      ],
      list: [],
      rules: {
        name: [{ required: true, message: '请输入疫苗名称', trigger: 'blur' }],
				type: [{ required: true, message: '请选择疫苗' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      vaccine: {
        name: '',
				type: 0,
				ages: '',
        times: '',
        description: '',
        tips: '',
				introduction: '',
				taboos: '',
				precautions: '',
				reactions: '',
				links: [],
				sort: 0,
        status: true
      },
			articlesList: [],
			typeList: [
				{
					id: 0,
					name: '免费'
				},
				{
					id: 1,
					name: '自费'
				}
			]
    }
  },
  mounted () {
		// this.deleteFields()
    this.getList()
		this.getArticlesList()
  },
  methods: {
    // 全选
    selectionChange (e) {
      this.ids = e.map(function (item) {
        return item['_id']
      })
    },
		// 删除字段
		async deleteFields () {
			const res = await getVaccinesAll()
			const { data } = res
			data.forEach(async item => {
				await deleteFields(item._id, ['age_id', 'times'])
				// await editVaccine(item._id, { sort: 0 })
			})
		},
    // 删除
    async del (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '是否删除?',
        onOk: async () => {
          await deleteVaccine(id)
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
            const errs = await batchDeleteVaccines(this.ids)
            if (!errs.length) {
              this.$Message.success('删除成功')
            } else {
              this.$Message.error('出错啦')
            }
            this.getList()
          }
        })
      } else {
        this.$Message.error('请选择要删除的数据')
      }
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
		// 免费/自费筛选
		typeSelectFilter (v) {
			this.limit.type = v
			this.getList()
		},
    // 获取列表
    async getList () {
      this.loading = true
			const art = await aggregateVaccinesList(this.limit)
			console.log('aggregateVaccinesList', art)
   //    const res = await getVaccinesList(this.limit)
			// console.log('getVaccinesList', res)
      const { list, total } = art
      this.limit.total = total
			this.list = list.map(item => {
			  return item
			})
			console.log('this.list:', this.list)
      this.loading = false
    },
		// 获取文章列表
		async getArticlesList () {
		  const res = await getAll()
		  console.log('getAll', res)
		  const { data } = res
		  this.articlesList = data
		},
    // 新增或编辑弹窗
    async addedit (action) {
      this.show = true
      if (action === 'add') {
				console.log(this.vaccine)
        this.showtitle = '新增疫苗'
        this.method = 'add'
      } else {
        this.showtitle = '编辑疫苗'
        this.method = 'edit'
        await this.getVaccine(action) // action = _id
      }
    },
    // 获取单个数据
    async getVaccine (id) {
      const res = await getVaccine(id)
			console.log(res)
      const { data } = res
			const vaccine = data[0]
			vaccine.status = !vaccine.status
			vaccine.sort = vaccine.sort || 0
			this.vaccine = vaccine
    },
    // 取消编辑&新增
    cancel () {
      this.method = ''
      this.reset()
      this.show = false
    },
		reset () {
			this.vaccine = {
				name: '',
				type: 0,
				ages: '',
				times: '',
				description: '',
				tips: '',
				introduction: '',
				taboos: '',
				precautions: '',
				reactions: '',
				links: [],
				sort: 0,
				status: true
			}
			this.$refs.resetSelect1.clearSingleSelect()
			this.$refs.resetSelect1.setQuery('')
		},
    // 提交
    confirm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.modal_loading = true
          const vaccine = Object.assign({}, this.vaccine)
					console.log('vaccineFormData', vaccine)
          try {
            vaccine.status = vaccine.status ? 0 : 1
            if (this.method === 'add') {
              console.log(vaccine)
              await addVaccine(vaccine)
            } else if (this.method === 'edit') {
              const id = vaccine._id
              Reflect.deleteProperty(vaccine, '_id')
              console.log(vaccine)
              await editVaccine(id, vaccine)
            }
            this.$Message.success({
              background: true,
              content: '保存成功'
            })
            this.modal_loading = false
          } catch (error) {
            this.modal_loading = false
          }
          this.getList()
          this.cancel()
        } else {
          this.$Message.error('请输入完整信息！')
        }
      })
    },
		toVaccineDetail (id) {
			console.log('vaccine clicked', id)
			this.$router.push({
				name: 'vaccine/detail',
				query: { id }
			})
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
/deep/.links {
	cursor: pointer;
	&:hover {
		color: #333!important;
		text-decoration: underline;
	}
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
