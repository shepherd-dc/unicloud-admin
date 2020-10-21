<template>
  <div class="vue-editor-nex">
    <vue-editor-nex
      v-model="content"
      :options="options"
      @ready="onEditorReady"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @change="onEditorChange"
      @image-upload="onImageUpload"
    />
  </div>
</template>

<script>
import { vueEditorNex } from '@/plugins/vueEditorNex'

export default {
  name: 'EditorNex',
  components: {
    vueEditorNex
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      content: ''
    }
  },
  watch: {
    value (v) {
      if (v) this.content = v
    }
  },
  methods: {
    onEditorBlur (editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus (editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady (editor) {
      // console.log('editor ready!', editor)
    },
    onEditorChange ({ editorNex, html, text, delta }) {
      // console.log('editor change!', editorNex, html, text)
      // const data = { html, delta: editorNex.editor.delta }
      this.$emit('input', html)
    },
    onImageUpload ({ range, editorNex }) {
      this.$emit('uploadImage', { range, editorNex })
    }
  }
}
</script>

<style lang="less" scoped>
	/deep/.ql-editor {
		padding: 20px;
	}
	/deep/.ql-toolbar {
		border-radius: 4px 4px 0 0;
	}
	/deep/.ql-container {
		border-radius: 0 0 4px 4px;
		height: 100%;
	}
	/deep/.ql-toolbar.ql-snow {
		padding: 0 0 0 8px!important;
		border-radius: 4px 4px 0 0;
	}
	/deep/.ql-container.ql-snow {
		border-radius: 0 0 4px 4px;
	}
	/deep/.ql-snow .ql-picker-label {
		line-height: 22px;
	}
</style>
