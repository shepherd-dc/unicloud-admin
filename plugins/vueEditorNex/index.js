import _EditorNex from '@/static/quill/editorNex.js'
import '@/static/quill/editorNex.snow.css'
import vueEditorNex from './editor.vue'

const EditorNex = window.EditorNex || _EditorNex
const install = (Vue, globalOptions) => {
  if (globalOptions) {
    vueEditorNex.props.globalOptions.default = () => globalOptions
  }
  Vue.component(vueEditorNex.name, vueEditorNex)
}

export default { EditorNex, vueEditorNex, install }
export { EditorNex, vueEditorNex, install }
