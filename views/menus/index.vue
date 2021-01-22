<template>
  <Card>
    <Button
      class="top"
      type="primary"
      @click="addedit('add')">添加栏目</Button>
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
      placeholder="栏目名称"
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
        ref="menu"
        :model="menu"
        :rules="rules"
        :label-width="80">
        <FormItem
          prop="sup_id"
          label="上级栏目">
          <Select
            ref="resetSelect"
            v-model="menu.sup_id"
            clearable
            filterable>
            <Option
              v-for="item in supmenusList"
              :value="item._id"
              :key="item._id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem
          prop="name"
          label="栏目名称">
          <Input
            v-model="menu.name"
            placeholder="请输入栏目名称"
            clearable />
        </FormItem>
        <FormItem
          prop="en_name"
          label="英文名称">
          <Input
            v-model="menu.en_name"
            placeholder="请输入英文名称"
            clearable />
        </FormItem>
        <FormItem
          prop="icon"
          label="栏目图标">
          <!-- 自定义上传图片组件 -->
          <upload-image
            v-model="menu.icon" />
        </FormItem>
        <FormItem
          label="栏目说明">
          <Input
            v-model="menu.description"
            :autosize="{minRows: 2, maxRows: 5}"
            type="textarea"
            maxlength="25"
            show-word-limit
            placeholder="请输入栏目说明" />
        </FormItem>
        <FormItem
          label="排序">
          <InputNumber
            :max="20"
            :min="0"
            v-model="menu.sort"></InputNumber>
        </FormItem>
        <FormItem
          label="状态"
          prop="status">
          <i-switch
            v-model="menu.status"
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
        @click="confirm('menu')">确定</Button></div>
    </Modal>
  </Card>
</template>

<script>
import { getAll, aggregateMenusList, addMenu, getMenu, editMenu, deleteMenu, batchDeleteMenu } from '@/api/menus'
import uploadImage from '@/components/upload/upload-image'
export default {
  components: {
    uploadImage
  },
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
				  title: '图标',
				  key: 'icon',
				  align: 'center',
				  width: '80px',
				  render: (h, res) => {
				    const icon = res.row.icon
            if (icon) {
              return h('div', {
                style: {
                  width: '40px',
                  height: '40px',
                  overflow: 'hidden',
                  'border-radius': '4px'
                }
              }, [
                h('img', {
								  attrs: {
								    src: icon
								  },
								  style: {
								    height: '100%'
								  }
                })
              ])
            }
				  }
        },
        {
          title: '栏目名称',
          key: 'name',
          align: 'center'
        },
        {
				  title: '英文名称',
				  key: 'en_name',
				  align: 'left',
          width: '140px'
        },
        {
				  title: '上级栏目',
				  key: 'sup_name',
				  align: 'center'
        },
        {
          title: '文章数',
          key: 'article_count',
          align: 'center',
          width: '100px',
          sortable: true,
          render: (h, res) => {
            const count = res.row.article_count || 0
            return h('span', count)
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
                color: res.row.status === 0 ? 'success' : 'error'
              }
            },
            res.row.status === 0 ? '正常' : '禁用'
            )
				  }
        },
        {
				  title: '栏目说明',
				  key: 'description',
				  align: 'left'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      list: [],
      rules: {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        en_name: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        sup_id: [{ required: true, message: '请选择上级栏目', trigger: 'blur' }],
        icon: [{ required: true, message: '请上传栏目图标' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      menu: {
        sup_id: '',
        name: '',
        en_name: '',
        icon: '',
        description: '',
        sort: 0,
        status: true
      },
      supmenusList: []
    }
  },
  mounted () {
    this.getList()
    this.getSupmenusList()
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
    // 获取列表
    async getList () {
      this.loading = true
      const res = await aggregateMenusList(this.limit, 'menus', 'supmenus')
      console.log('aggregateMenusList:', res)
      const { list, total } = res
      this.limit.total = total
      this.list = list.map(item => {
        item.sup_name = item.supmenus.length ? item.supmenus[0].name : ''
        Reflect.deleteProperty(item, 'supmenus')
        item.article_count = item.articles.length
				 Reflect.deleteProperty(item, 'articles')
        return item
      })
      console.log('this.list:', this.list)
      this.loading = false
    },
    // 获取上级栏目列表
    async getSupmenusList () {
		  const res = await getAll('supmenus')
      console.log('getAll', res)
		  const { data } = res
		  this.supmenusList = data
    },
    // 新增或编辑弹窗
    async addedit (action) {
      this.show = true
      if (action === 'add') {
        this.showtitle = '新增栏目'
        this.method = 'add'
      } else {
        this.showtitle = '编辑栏目'
        this.method = 'edit'
        await this.getMenu(action) // action = _id
      }
    },
    // 获取单个数据
    async getMenu (id) {
      const res = await getMenu(id, 'menus')
      const { data } = res
      const [menu] = data
      this.menu = menu
      this.menu.status = !menu.status
      this.menu.sort = menu.sort || 0
    },
    // 取消编辑&新增
    cancel () {
      this.method = ''
      this.menu = {
        sup_id: '',
        name: '',
        en_name: '',
        icon: '',
        description: '',
        sort: 0,
        status: true
      }
      // 重置Select组件选择状态及搜索条件
      this.$refs.resetSelect.clearSingleSelect()
      this.$refs.resetSelect.setQuery('')
      this.show = false
    },
    // 提交
    confirm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.modal_loading = true
          const menu = Object.assign({}, this.menu)
          try {
            menu.status = menu.status ? 0 : 1
            if (this.method === 'add') {
              console.log(menu)
              await addMenu(menu, 'menus')
            } else if (this.method === 'edit') {
              const id = menu._id
              Reflect.deleteProperty(menu, '_id')
              console.log(menu)
              await editMenu(id, menu, 'menus')
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
    // 删除
    async del (id) {
		  this.$Modal.confirm({
		    title: '提示信息',
		    content: '是否删除?',
		    onOk: async () => {
		      await deleteMenu(id, 'menus')
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
		        const errs = await batchDeleteMenu(this.ids, 'menus')
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
