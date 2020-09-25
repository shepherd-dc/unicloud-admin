<template>
  <div class="article-edit">
    <h3 class="header">新建文章</h3>
    <Form
      ref="article"
      :model="article"
      :rules="rules"
      :label-width="80">
			<FormItem
			  prop="category_id"
			  label="栏目">
			  <Select
					ref="resetSelect"
			    v-model="article.category_id"
					placeholder="请选择栏目"
					filterable
			    clearable>
					<OptionGroup
						v-for="sup in supmenusList"
						:key="sup._id"
						:label="sup.name">
						<Option
			      v-for="item in sup.menus"
			      :value="item._id"
			      :key="item._id">{{ item.name }}</Option>
					</OptionGroup>
			  </Select>
			</FormItem>
      <FormItem
        prop="title"
        label="标题">
        <Input
          v-model="article.title"
          placeholder="请输入文章标题"
          clearable />
      </FormItem>
      <FormItem
        prop="content"
        label="正文">
        <editor-nex
          v-model="article.content"
          @uploadImage="handleUploadImage" />
      </FormItem>
      <FormItem
        prop="avatar"
        label="缩略图">
        <!-- 自定义上传图片组件 -->
        <upload-image
          v-model="article.avatar"
          text="上传缩略图" />
      </FormItem>
      <FormItem
        label="文章摘要">
        <Input
          v-model="article.excerpt"
          :autosize="{minRows: 3, maxRows: 5}"
          type="textarea"
          maxlength="100"
          show-word-limit
          placeholder="请输入文章摘要" />
      </FormItem>
      <FormItem
        label="排序">
        <InputNumber
          :max="20"
          :min="0"
          v-model="article.sort"></InputNumber>
      </FormItem>
      <FormItem
        label="置顶"
        prop="status">
        <i-switch
          v-model="article.is_sticky"
          size="large">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
    </Form>
    <div class="footer">
			<Button
				:loading="loading"
				type="success"
				size="large"
				@click="confirm('article')">发 布</Button>
			<Button
				type="primary"
				size="large"
				@click="cancel()">存草稿</Button>
			<Button
				type="default"
				size="large"
				@click="cancel()">重 置</Button>
		</div>
  </div>
</template>

<script>
import editorNex from '@/components/editor/editor-nex'
import uploadImage from '@/components/upload/upload-image'
import upload from '@/utils/upload'
import { aggregateGetAll } from '@/api/menus'

const defaultForm = {
	_id: '',
	title: '',
	content: '',
	avatar: '',
	excerpt: '',
	category_id: '',
	user_id: '',
	sort: 0,
	is_sticky: false
}

export default {
  components: {
    uploadImage,
    editorNex
  },
  data () {
    return {
      article: Object.assign({}, defaultForm),
      rules: {
				category_id: [{ required: true, message: '请选择栏目', trigger: 'blur' }],
				title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
				content: [{ required: true, message: '正文不能为空', trigger: 'blur' }],
			},
      loading: false,
			supmenusList: []
    }
  },
	mounted () {
		this.getSupmenusList()
	},
  methods: {
		// 获取上级栏目列表
		async getSupmenusList () {
		  const res = await aggregateGetAll('supmenus')
		  console.log('aggregateGetAll', res)
		  const { data } = res
		  this.supmenusList = data
		},
    async handleUploadImage ({ range, editorNex }) {
      console.log(range, editorNex)
      const res = await upload()
			console.log('upload result:', res)

      const src = res.fileID
      // 前面空一行
      editorNex.insertText(range.index, '\n', 'user')
      // 插入图片
      editorNex.insertEmbed(range.index + 1, 'image', src, 'user')
      // 别忘了更新光标位置
      editorNex.setSelection(range.index + 2, 'silent')
    },
    confirm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          const article = Object.assign({}, this.article)
					console.log('article:', article, defaultForm)
          try {
            if (!this.article._id) {
              console.log('article form:', article)
              // await addMenu(article)
            } else {
              const id = article._id
              Reflect.deleteProperty(article, '_id')
              console.log('article form:', article)
              // await editMenu(id, article)
            }
            this.$Message.success({
              background: true,
              content: '保存成功'
            })
            this.loading = false
          } catch (error) {
            this.loading = false
          }
          // this.getList()
          // this.cancel()
        } else {
          this.$Message.error('请输入完整信息！')
        }
      })
    },
		cancel () {
			this.article = defaultForm
		}
  }
}
</script>

<style lang="less" scoped>
	.article-edit {
		background-color: #fff;
		padding: 20px 40px 20px 20px;
		.header {
			padding: 10px 10px 8px 0;
			border-bottom: 1px solid #dcdee2;
			margin: 0 0 30px 20px;
		}
		.footer {
			display: flex;
			padding-left: 20px;
		}
	}
	/deep/.ivu-btn {
		margin-right: 10px;
		width: 160px;
	}
</style>
