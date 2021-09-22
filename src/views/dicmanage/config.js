export default {
  form: {
    layout: {
      use: 'inline',
      gutter: 20,
      direction: 'column'
    },
    forms: [
      {
        label: '字典值分类名称',
        prop: 'name',
        use: 'input',
        type: 'input',
        placeholder: '卫健局',
        size: 'small',
        width: '300px',
        required: true,
        rules: [
          {
            required: true,
            message: '请输入字典值分类名称',
            trigger: 'change'
          },
          { required: true, message: '请输入字典值分类名称', trigger: 'blur' }
        ]
      },
      {
        label: '备注',
        prop: 'remark',
        use: 'input',
        type: 'input',
        placeholder: '卫健局',
        size: 'small',
        required: true,
        rules: [
          { required: true, message: '请输入备注', trigger: 'change' },
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
    ]
  }
}
