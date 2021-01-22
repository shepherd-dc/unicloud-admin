<template>
  <Card>
    <Button
      class="top"
      type="primary"
      @click="addedit('add')">添加用户</Button>
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
      placeholder="用户名"
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
          @click="deleted(row._id)" />
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
        ref="user"
        :model="user"
        :rules="rules"
        :label-width="80">
        <FormItem
          prop="username"
          label="账号"><Input
            v-model="user.username"
            placeholder="请输入账号"
            clearable /></FormItem>
				<FormItem
					prop="password"
					label="密码"><Input
						v-model="user.password"
						type="password"
						placeholder="请输入密码"
						clearable /></FormItem>
				<FormItem
					v-if="method === 'add'"
					prop="passwdCheck"
					label="确认密码">
					<Input
						v-model="user.passwdCheck"
						type="password"
						placeholder="请输入确认密码"
						clearable />
				</FormItem>
        <FormItem
					v-if="method === 'add' || user.roles_id"
          prop="roles_id"
          label="部门">
          <Select
            v-model="user.roles_id"
            clearable
            filterable>
            <Option
              v-for="item in roles"
              v-model="item._id"
              :key="item._id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="状态"
          prop="status">
          <i-switch
            v-model="user.status"
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
        @click="confirm('user')">确定</Button></div>
    </Modal>
  </Card>
</template>

<script>
import { getRolesList } from '@/api/roles'
import { aggregateUsersList, addUser, getUser, editUser, deleteUser, batchDeleteUser } from '@/api/users'
import { formatDate } from '@/utils/tools'
import { validateUse, validatePass } from '@/utils/checker'
export default {
  data () {
		const validatePassCheck = (rule, value, callback) => {
		  if (!value) {
		    callback(new Error('请再次输入密码'))
		  } else if (value !== this.user.password) {
		    callback(new Error('两次密码不一致'))
		  } else {
		    callback()
		  }
		}
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
          title: 'wx_openid',
					width: 180,
					render: (h, res) => {
					  return h('span', res.row.wx_openid['mp-weixin'])
					}
        },
        {
          title: '角色',
          align: 'center',
          render: (h, res) => {
            return h('span', res.row.roles.length ? res.row.roles[0].name : '普通用户')
          }
        },
        {
          title: '权限',
          align: 'center',
          render: (h, res) => {
            return h('span', res.row.roles.length ? res.row.roles[0].node.join(', ') : '--')
          }
        },
				{
				  title: '注册时间',
				  align: 'center',
				  render: (h, res) => {
				    const register_date = res.row.register_date ? formatDate(res.row.register_date) : '--'
				    return h('span', register_date)
				  }
				},
				{
				  title: '注册IP',
				  align: 'center',
					render: (h, res) => {
					  return h('span', res.row.register_ip ? res.row.register_ip : '--')
					}
				},
				{
				  title: '上次登录时间',
				  align: 'center',
				  render: (h, res) => {
				    const last_login_date = res.row.last_login_date ? formatDate(res.row.last_login_date) : '--'
				    return h('span', last_login_date)
				  }
				},
				{
				  title: '上次登录IP',
				  align: 'center',
					render: (h, res) => {
					  return h('span', res.row.last_login_ip ? res.row.last_login_ip : '--')
					}
				},
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      list: [],
			roles:[],
			method: undefined,
      rules: {
        username: [{ required: true, validator: validateUse, trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        passwdCheck: [{ required: true, validator: validatePassCheck, trigger: 'blur' }],
        roles_id: [{ required: true, message: '请选择部门' }],
        status: [{ required: true, message: '请选择状态' }]
      },
			user: {
			  username: '',
			  roles_id: '',
				password: '',
				passwdCheck: '',
			  status: true
			}
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 权限选择
    checkChange (e) {
      var access = []
      e.forEach(res => {
        if (res.access) {
          access.push(res.access[0])
        }
      })
      this.department.node = access
    },
    // 全选
    selectionChange (e) {
      this.ids = e.map(function (item) {
        return item['_id']
      })
    },
    // 删除
    async deleted (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '是否删除?',
        onOk: async () => {
          try {
            await deleteUser(id)
            this.$Message.success('删除成功')
          } catch (error) {}
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
            try {
              await batchDeleteUser(this.ids)
              this.$Message.success('删除成功')
            } catch (error) {}
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
      try {
        const res = await aggregateUsersList(this.limit)
				console.log('aggregateUsersList', res)
				const roles = (await getRolesList({})).data
				this.roles = roles
				const { list, total } = res
        this.limit.total = total
        this.list = list.filter(item => !item.roles_id)
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
		// 获取单个数据
		async getUser (id) {
		  try {
		    const { data } = await getUser(id)
				if (data.length) {
					const res = data[0]
					this.user = res
					this.user.status = !res.status
				} 
		  } catch (error) {
		    console.error(error)
		  }
		},
    // 新增或编辑弹窗
    addedit (action) {
      this.show = true
      if (action === 'add') {
        this.showtitle = '新增用户'
        this.method = 'add'
      } else {
        this.showtitle = '编辑用户'
        this.method = 'edit'
        this.getUser(action)
      }
    },
    // 取消编辑&新增
    cancel () {
      this.method = ''
      this.user = {
        username: '',
        password: '',
        roles_id: '',
        status: true
      }
      this.show = false
    },
    // 提交
    confirm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // console.log(this.user)
          if (this.user._id !== '5f45d5fe8752410001896b90') {
            this.modal_loading = true
            // const user = cloneDeep(this.user)
            const user = Object.assign({}, this.user)
            try {
              user.status = user.status ? 0 : 1
              delete user.passwdCheck
              if (this.method === 'add') {
                await addUser(user)
              } else if (this.method === 'edit') {
								const id = user._id
								const { username, roles_id, status } = user 
								const data = {
									username, roles_id, status
								}
								console.log('editUser', id, data)
                await editUser(id, data)
              }
              this.$Message.success({
                background: true,
                content: '保存成功'
              })
              this.modal_loading = false
              this.getList()
              this.cancel()
            } catch (error) {
              console.error(error)
            }
          } else {
            this.$Message.error('禁止操作')
          }
        } else {
          this.$Message.error('请输入完整信息！')
        }
      })
    }
  }
}
</script>

<style>
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
</style>
