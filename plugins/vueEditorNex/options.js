export default {
  theme: 'snow',
  boundary: document.body,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ list: 'ordered' }, { list: 'bullet' },
        { indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ align: [] }, { direction: 'rtl' }], // text direction

      ['blockquote', 'code-block'],

      ['link', 'image'],
      ['previous', 'next'],

      [{ header: [] }, { font: [] }, { size: [] }],
      [{'line-height': [] }],

      ['clean'] // remove formatting button
    ],
  //   title: {
  //     container: '.ql-title',
  //     options: {
  //       placeholder: '报告标题'
  //       // maxlength: 100
  //     }
  //   },
  //   extension: {
  //     container: '.ql-extension',
  //     element: [
  //       { tagName: 'input', className: 'ql-subtitle', placeholder: '副标题' },
  //       { tagName: 'textarea', className: 'ql-introduction', placeholder: '导读请用一、两句话概括本报告结论。注意写明本报告的核心观点、超预期和差异化，不应罗列公告数据，描述已知信息。' }
  //     ]
  //   },
  //   counter: [
  //     {
  //       container: '#counter',
  //       eventName: 'extension-textarea-change',
  //       total: 100
  //     }
  //   ]
  },
  // placeholder: '书写正文...',
  readOnly: false
}
