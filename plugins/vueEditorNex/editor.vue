<template>
  <div class="editor-nex">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
// require sources
import _EditorNex from '@/static/quill/editorNex.js'
import defaultOptions from './options'
const EditorNex = window.EditorNex || _EditorNex
// let once = true

// polyfill
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value (target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      const to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}

// export
export default {
  name: 'VueEditorNex',
  props: {
    title: String,
    subtitle: String,
    introduction: String,
    content: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    globalOptions: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data () {
    return {
      assignedOptions: {},
      editorContent: '',
      customTitle: '',
      customSubtitle: '',
      customIntroduction: '',
      defaultOptions
    }
  },
  watch: {
    // Watch content change
    content (newVal, oldVal) {
      if (this.editorNex) {
        if (newVal && newVal !== this.editorContent) {
          this.editorContent = newVal
          this.editorNex.clipboard.dangerouslyPasteHTML(newVal)
        } else if (!newVal) {
          this.editorNex.setText('')
        }
      }
    },
    // Watch content change
    value (newVal, oldVal) {
      if (this.editorNex) {
        if (newVal && newVal !== this.editorContent) {
          this.editorContent = newVal
          this.editorNex.clipboard.dangerouslyPasteHTML(newVal)
        } else if (!newVal) {
          this.editorNex.setText('')
        }
      }
    },
    // Watch title change
    title (newVal, oldVal) {
      if (this.editorNex && newVal !== this.customTitle) {
        this.customTitle = newVal == null ? '' : newVal
        this.editorNex.titleContainer.firstElementChild.value = newVal
      }
    },
    // Watch subtitle change
    subtitle (newVal, oldVal) {
      if (this.editorNex && newVal !== this.customSubtitle) {
        if (!this.verifyExtension('input')) return
        this.customSubtitle = newVal == null ? '' : newVal
        const subtitleInput = document.querySelector('.ql-extension-input')
        subtitleInput.value = newVal
        // if (subtitleOnce) {
        this.initWordsLength('extension-input-change', newVal)
        //   subtitleOnce = false
        // }
      }
    },
    // Watch introduction change
    introduction (newVal, oldVal) {
      if (this.editorNex && newVal !== this.customSubtitle) {
        if (!this.verifyExtension('textarea')) return
        this.customIntroduction = newVal == null ? '' : newVal
        const introductionTextarea = document.querySelector('.ql-extension-textarea')
        introductionTextarea.value = newVal
        // if (once) {
        this.initWordsLength('extension-textarea-change', newVal)
        //   once = false
        // }
      }
    },
    // Watch disabled change
    disabled (newVal, oldVal) {
      if (this.editorNex) {
        this.editorNex.enable(!newVal)
      }
    }
  },
  mounted () {
    this.initialize()
  },
  beforeDestroy () {
    this.editorNex = null
    delete this.editorNex
  },
  methods: {
    // Init EditorNex instance
    initialize () {
      if (this.$el) {
        // Merge options
        this.assignedOptions = Object.assign({}, this.defaultOptions, this.globalOptions, this.options)
        // Cover toolbar options
        const modules = this.assignedOptions.modules
        if (this.options.toolbar != null) {
          modules.toolbar = this.options.toolbar
          delete this.options.toolbar
        }

        // Instance
        this.editorNex = new EditorNex(this.$refs.editor, this.assignedOptions)

        this.editorNex.enable(false)

        // Set editor content
        if (this.value || this.content) {
          this.editorNex.clipboard.dangerouslyPasteHTML(this.value || this.content)
        }

        // Set title
        if (this.title) {
          this.editorNex.titleContainer.firstElementChild.value = this.title
        }

        // Set subtitle
        if (this.subtitle) {
          const subtitleInput = document.querySelector('.ql-extension-input')
          subtitleInput.value = this.subtitle
        }

        // Set introduction
        if (this.introduction) {
          const introductionTextarea = document.querySelector('.ql-extension-textarea')
          introductionTextarea.value = this.introduction
        }

        // Disabled editor
        if (!this.disabled) {
          this.editorNex.enable(true)
        }

        // Mark model as touched if editor lost focus
        this.editorNex.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.editorNex)
          } else {
            this.$emit('focus', this.editorNex)
          }
        })

        // Update model if text changes
        this.editorNex.on('text-change', (delta, oldDelta, source) => {
          // const children = Array.from(this.$refs.editor.children)
          // const editor = children.slice(-3, -1)[0]
          const editor = document.querySelector('.ql-editor')
          let html = editor.innerHTML
          const editorNex = this.editorNex
          const text = this.editorNex.getText()
          if (html === '<p><br></p>') html = ''
          this.editorContent = html
          this.$emit('input', this.editorContent)
          this.$emit('change', { html, text, delta, editorNex })
        })

        // Update model if title changes
        if (modules.title) {
          this.editorNex.on('title-change', (value, event, source) => {
            this.customTitle = value
            this.$emit('title-change', { value, event, source })
          })
        }

        // Upload image
        this.editorNex.on('image-upload', (range, source) => {
          const editorNex = this.editorNex
          this.$emit('image-upload', { range, editorNex })
        })

        // Mso image alert
        this.editorNex.on('mso-image', (msg, node, source) => {
          this.$emit('mso-image', { msg, node, source })
        })

        // History list
        this.editorNex.on('history-list', (dom, stack, source) => {
          this.$emit('history-list', { dom, stack, source })
        })

        // Extension events
        if (modules.extension) {
          this.editorNex.on('extension-input-change', (value, event, source) => {
            this.customSubtitle = value
            this.$emit('extension-input-change', { value, event, source })
          })
          this.editorNex.on('extension-textarea-change', (value, event, source) => {
            this.customIntroduction = value
            this.$emit('extension-textarea-change', { value, event, source })
          })
        }

        // Emit ready event
        this.$emit('ready', this.editorNex)
      }
    },
    initWordsLength (type, val) {
      const counters = this.assignedOptions.modules.counter
      let counter
      if (Array.isArray(counters)) {
        counter = counters.filter(count => count.eventName === type)[0]
      } else {
        counter = counters
      }
      this.initCounter(counter, val)
    },
    initCounter (counter, val) {
      if (!counter) return
      const container = document.querySelector(counter.container)
      const total = counter.total
      const length = this.editorNex.getWordsLength(val)
      container.innerText = total ? `${length} / ${total}` : `字数: ${length}`
    },
    verifyExtension (type) {
      if (!this.options.modules || !this.options.modules.extension || !this.options.modules.extension.element) return false
      const typeArr = this.options.modules.extension.element.filter(v => v.tagName === type)
      if (!typeArr.length) return false
      return true
    }
  }
}
</script>
