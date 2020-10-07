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
			ref="resetSelect"
			class="top inpt"
		  v-model="limit.age_id"
			@on-change="selectFilter"
			placeholder="请选择月龄/年龄"
		  clearable>
			<Option
			  v-for="age in agesList"
			  :value="age._id"
			  :key="age._id">{{ age.month_name || age.age_name }}</Option>
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
				  prop="age_id"
				  label="月龄年龄">
				  <Select
						ref="resetSelect"
				    v-model="vaccine.age_id"
						placeholder="请选择月龄/年龄"
				    clearable
				    filterable>
				    <Option
				      v-for="item in agesList"
				      :value="item._id"
				      :key="item._id">{{ item.month_name || item.age_name }}</Option>
				  </Select>
				</FormItem>
				<FormItem
				  prop="times"
				  label="接种次数">
				  <Input
				    v-model="vaccine.times"
				    placeholder="请输入接种次数"
						clearable />
				</FormItem>
				<FormItem
					prop="type"
				  label="疫苗类型">
				  <Select
				  	ref="resetSelect"
				    v-model="vaccine.type"
				    clearable
				    filterable>
				    <Option
				      v-for="item in typeList"
				      :value="item.id"
				      :key="item.id">{{ item.name }}</Option>
				  </Select>
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
      <div slot="footer"><Button
        :loading="modal_loading"
        type="primary"
        size="large"
        long
        @click="confirm('vaccine')">确定</Button></div>
    </Modal>
  </Card>
</template>

<script>
import { aggregateVaccineList, addVaccine, getVaccine, editVaccine, deleteVaccine, batchDeleteVaccine } from '@/api/vaccine'
import { getAgesAll } from '@/api/ages'
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
				age_id: '',
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
					  const name = res.row.name || '--'
					  return h('span', name)
					}
				},
				{
				  title: '接种次数',
				  key: 'times',
				  align: 'center'
				},
        {
          title: '月龄/年龄',
          key: 'month_age',
          align: 'center',
          width: '120px',
          sortable: true
        },
				{
				  title: '疫苗类型',
				  key: 'type',
				  align: 'center',
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
				{
				  title: '说明',
				  key: 'description',
				  align: 'left'
				},
				{
				  title: '小贴士',
				  key: 'tips',
				  align: 'left'
				},
        {
				  title: '排序',
				  key: 'sort',
				  align: 'center',
          width: '100px',
          sortable: true
        },
        {
				  title: '状态',
				  key: 'status',
				  align: 'center',
				  render: (h, res) => {
						return h('Tag', {
								attrs: {
									color: res.row.status === 0 ? 'success': 'error'
								}
							},
							res.row.status === 0 ? '正常' : '禁用'
						)
				  }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      list: [],
      rules: {
        name: [{ required: true, message: '请输入疫苗名称', trigger: 'blur' }],
        age_id: [{ required: true, message: '请选择月龄/年龄', trigger: 'blur'  }],
				times: [{ required: true, message: '请输入接种次数', trigger: 'blur' }],
				type: [{ required: true, message: '请选择疫苗' }],
				age: [{ required: true, message: '请输入年龄数', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      vaccine: {
        name: '',
        age_id: '',
        type: 0,
        times: '',
        description: '',
        tips: '',
				sort: 0,
        status: true
      },
			agesList: [],
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
    this.getList()
		this.getAgesList()
  },
  methods: {
    // 全选
    selectionChange (e) {
      this.ids = e.map(function (item) {
        return item['_id']
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
            const errs = await batchDeleteVaccine(this.ids)
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
		// 月龄筛选
		selectFilter (v) {
			this.limit.age_id = v
			this.getList()
		},
    // 获取列表
    async getList () {
      this.loading = true
      const res = await aggregateVaccineList(this.limit)
			console.log('aggregateVaccineList', res)
      const { list, total } = res
      this.limit.total = total
			this.list = list.map(item => {
			  item.month_age = item.ages.length ? (item.ages[0].month_name || item.ages[0].age_name) : ''
			  Reflect.deleteProperty(item, 'ages')
			  return item
			})
			console.log('this.list:', this.list)
      this.loading = false
    },
		// 获取月龄列表
		async getAgesList () {
		  const res = await getAgesAll()
		  console.log('getAgesAll', res)
		  const { data } = res
		  this.agesList = data
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
      this.vaccine = {
        name: '',
        age_id: '',
        type: 0,
        times: '',
        description: '',
        tips: '',
        sort: 0,
        status: true
      }
      this.show = false
    },
    // 提交
    confirm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.modal_loading = true
          const vaccine = Object.assign({}, this.vaccine)
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
