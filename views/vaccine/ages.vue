<template>
  <Card>
    <Button
      class="top"
      type="primary"
      @click="addedit('add')">添加月龄</Button>
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
      placeholder="月龄/年龄名称"
      @on-search="getList"
      @on-change="getList" />
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
        ref="age"
        :model="age"
        :rules="rules"
        :label-width="80">
				<FormItem
					prop="month"
				  label="月龄数">
				  <Input
						type="number"
				    v-model="age.month"
						@on-blur="monthBlur"
						placeholder="请输入月龄数" />
				</FormItem>
        <FormItem
          prop="month_name"
          label="月龄名称">
          <Input
            v-model="age.month_name"
            placeholder="请输入月龄名称"
            clearable />
        </FormItem>
				<FormItem
					prop="age"
				  label="年龄数">
				  <Input
				    v-model="age.age"
						@on-blur="ageBlur"
						placeholder="请输入年龄数" />
				</FormItem>
				<FormItem
				  prop="age_name"
				  label="年龄名称">
				  <Input
				    v-model="age.age_name"
				    placeholder="请输入年龄名称"
				    clearable />
				</FormItem>
        <FormItem
          label="排序">
          <InputNumber
            :max="20"
            :min="0"
            v-model="age.sort"></InputNumber>
        </FormItem>
        <FormItem
          label="状态"
          prop="status">
          <i-switch
            v-model="age.status"
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
        @click="confirm('age')">确定</Button></div>
    </Modal>
  </Card>
</template>

<script>
import { getAgesList, addAge, getAge, editAge, deleteAge, batchDeleteAge } from '@/api/ages'
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
				  title: '月龄数',
				  key: 'month',
				  align: 'center',
				  width: '100px',
				  sortable: true
				},
        {
          title: '月龄名称',
          key: 'month_name',
          align: 'center',
					render: (h, res) => {
					  const name = res.row.month_name || '--'
					  return h('span', name)
					}
        },
        {
          title: '年龄数',
          key: 'age',
          align: 'center',
          width: '100px',
          sortable: true
        },
				{
				  title: '年龄名称',
				  key: 'age_name',
				  align: 'center',
					render: (h, res) => {
					  const name = res.row.age_name || '--'
					  return h('span', name)
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
				  title: '状态',
				  key: 'status',
				  align: 'center',
          width: '100px',
				  render: (h, res) => {
				    // return h('span', res.row.status === 0 ? '正常' : '禁用')
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
        // month_name: [{ required: true, message: '请输入月龄名称', trigger: 'blur' }],
        month: [{ required: true, message: '请输入月龄数', trigger: 'blur' }],
				// age_name: [{ required: true, message: '请输入年龄名称', trigger: 'blur' }],
				age: [{ required: true, message: '请输入年龄数', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      age: {
        month: '',
        month_name: '',
        age: '',
        age_name: '',
				sort: 0,
        status: true
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 全选
    selectionChange (e) {
      this.ids = e.map(function (item) {
        return item['_id']
      })
    },
		monthBlur () {
			this.age.month && (this.age.age = String((this.age.month / 12).toFixed(2)))
		},
		ageBlur () {
			this.age.age && (this.age.month = String(Math.ceil(this.age.age * 12)))
		},
    // 删除
    async del (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '是否删除?',
        onOk: async () => {
          await deleteAge(id)
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
            const errs = await batchDeleteAge(this.ids)
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
    // 获取列表
    async getList () {
      this.loading = true
      const res = await getAgesList(this.limit)
			console.log('getAgesList', res)
      const { list, total } = res
      this.limit.total = total
      this.list = list
      this.loading = false
    },
    // 新增或编辑弹窗
    async addedit (action) {
      this.show = true
      if (action === 'add') {
				console.log(this.age)
        this.showtitle = '新增月龄'
        this.method = 'add'
      } else {
        this.showtitle = '编辑月龄'
        this.method = 'edit'
        await this.getAge(action) // action = _id
      }
    },
    // 获取单个数据
    async getAge (id) {
      const res = await getAge(id)
			console.log(res)
      const { data } = res
			const age = data[0]
			age.month = String(age.month)
			age.status = !age.status
			age.sort = age.sort || 0
      this.age = age
    },
    // 取消编辑&新增
    cancel () {
      this.method = ''
      this.age = {
        month: '',
        month_name: '',
        age: '',
        age_name: '',
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
          const age = Object.assign({}, this.age)
          try {
            age.month = Number(age.month)
            age.status = age.status ? 0 : 1
            if (this.method === 'add') {
              console.log(age)
              await addAge(age)
            } else if (this.method === 'edit') {
              const id = age._id
              Reflect.deleteProperty(age, '_id')
              console.log(age)
              await editAge(id, age)
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
	width: 300px;
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
