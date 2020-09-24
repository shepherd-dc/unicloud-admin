<template>
  <div class="vue-editor-nex">
    <vue-editor-nex
      v-model="docData.html"
      :title="docData.title || ''"
      :subtitle="docData.subtitle || ''"
      :introduction="docData.writetip || ''"
      :options="options"
      @ready="onEditorReady($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
      @title-change="onTitleChange($event)"
      @image-upload="onImageUpload($event)"
      @mso-image="onMsoImage($event)"
      @history-list="onHistoryList($event)"
      @extension-input-change="onExtensionInputChange($event)"
      @extension-textarea-change="onExtensionTextareaChange($event)"
    />
  </div>
</template>

<script>
import { vueEditorNex } from '@/plugins/vueEditorNex'

export default {
  name: 'editor-nex',
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
    docData: {
      type: Object,
      default: () => ({})
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
      const data = { html, delta: editorNex.editor.delta, height: this.$el.offsetHeight }
      this.$emit('deliverContent', data)
    },
    onTitleChange ({ value, event, source }) {
      // console.log('title change!', value, event, source)
      this.$emit('deliverTitle', value)
    },
    onImageUpload ({ files, range, editorNex }) {
      this.$emit('uploadImage', { files, range, editorNex })
    },
    onMsoImage ({ msg, node, source }) {
      alert(msg)
      console.log(node)
    },
    onHistoryList ({ dom, stack, source }) {
      this.$emit('historyList', { dom, stack, source })
    },
    onExtensionInputChange ({ value, event, source }) {
      this.$emit('deliverSubtitle', { value, event })
    },
    onExtensionTextareaChange ({ value, event, source }) {
      this.$emit('deliverIntroduction', { value, event })
    }
  }
}
</script>

<style lang="less" scoped>
	/deep/.ql-editor {
		padding: 20px;
	}
</style>
