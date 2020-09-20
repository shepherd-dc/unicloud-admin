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
        ref="supmenu"
        :model="supmenu"
        :rules="rules"
        :label-width="80">
        <FormItem
          prop="name"
          label="栏目名称">
          <Input
            v-model="supmenu.name"
            placeholder="请输入栏目名称"
            clearable />
        </FormItem>
        <FormItem
          prop="icon"
          label="栏目图标">
          <div class="icon-box">
            <Button
              icon="ios-cloud-upload-outline"
              @click="handleUpload">上传图标</Button>
            <div
              v-show="showIcon"
              class="icon-image">
              <img :src="supmenu.icon" />
            </div>
          </div>
          <Progress
            v-show="showProgress"
            :percent="percent"/>
        </FormItem>
        <FormItem
          label="栏目说明">
          <Input
            v-model="supmenu.description"
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
            v-model="supmenu.sort"></InputNumber>
        </FormItem>
        <FormItem
          label="状态"
          prop="status">
          <i-switch
            v-model="supmenu.status"
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
        @click="confirm('supmenu')">确定</Button></div>
    </Modal>
  </Card>
</template>

<script>
import { getMenusList, addMenu, getMenu, editMenu, deleteMenu, batchDeleteMenu } from '@/api/menus'
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
            		    height: '100%',
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
          title: '文章数',
          key: 'article_count',
          align: 'center',
          width: '100px',
          sortable: true,
          render: (h, res) => {
            const count = res.row.article_count || '--'
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
				    return h('span', res.row.status === 0 ? '正常' : '禁用')
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
        icon: [{ required: true, message: '请上传栏目图标' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      supmenu: {
        name: '',
        icon: '',
        description: '',
        sort: 0,
        status: true
      },
      percent: 0,
      showProgress: false,
      showIcon: false
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
    // 删除
    async del (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '是否删除?',
        onOk: async () => {
          await deleteMenu(id)
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
            const errs = await batchDeleteMenu(this.ids)
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
    // 获取列表
    async getList () {
      this.loading = true
      const res = await getMenusList(this.limit)
      const { list, total } = res
      this.limit.total = total
      this.list = list
      this.loading = false
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
    		if (this.supmenu.icon) this.showIcon = true
      }
    },
    // 获取单个数据
    async getMenu (id) {
      const res = await getMenu(id)
      const { data } = res
      const [menu] = data
      this.supmenu = menu
      this.supmenu.status = !menu.status
      this.supmenu.sort = menu.sort || 0
    },
    // 取消编辑&新增
    cancel () {
      this.method = ''
      this.supmenu = {
        name: '',
        icon: '',
        description: '',
        sort: 0,
        status: true
      }
      this.show = false
    },
    handleUpload () {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          console.log(res)
          if (res.tempFilePaths.length > 0) {
            const tempFilePath = res.tempFilePaths[0]
            const tempFile = res.tempFiles[0].name
            // 进行上传操作
            const result = await uniCloud.uploadFile({
              filePath: tempFilePath,
              cloudPath: tempFile,
              onUploadProgress: (progressEvent) => {
                this.showProgress = true
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                this.percent = percentCompleted
              }
            })
            this.showProgress = false
            this.supmenu.icon = result.fileID
            this.showIcon = true
            console.log(result)
          }
        },
        fail (err) {
          console.error(err)
        }
      })
    },
    // 提交
    confirm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.modal_loading = true
          const supmenu = Object.assign({}, this.supmenu)
          try {
            supmenu.status = supmenu.status ? 0 : 1
            if (this.method === 'add') {
              console.log(supmenu)
              await addMenu(supmenu)
            } else if (this.method === 'edit') {
              const id = supmenu._id
              Reflect.deleteProperty(supmenu, '_id')
              console.log(supmenu)
              await editMenu(id, supmenu)
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
.icon-box {
	display: flex;
	align-items: center;
}
.icon-image {
	margin-left: 20px;
	overflow: hidden;
	width: 40px;
	height: 40px;
	border-radius: 4px;
	img {
		height: 100%;
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
