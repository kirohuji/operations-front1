import { service } from '../service'
export default {
  schema: [],
  table: {
    column: [],
    data: [],
    total: 0,
    page: {
      layout: `total, sizes, prev, pager, next, jumper`,
      currentPage: 1,
      pageSizes: [10, 15, 30, 100],
      pageSize: 10,
      background: false
    }
  },
  dialog: {
    layout: {
      use: 'inline'
    }
  },
  forms: {
    data: {},
    forms: [
      {
        label: '分类选择',
        prop: 'node_id',
        use: 'label-select',
        async: true,
        style:
          'color: #5A5E66;margin: 0px 10px;margin-top: 6px;line-height: 20px',
        disabled: true,
        options: function() {
          return {
            runner: service.getcategorylist.bind(service),
            params: {},
            default: [],
            immediate: true,
            callback: data =>
              data.list.map(item => {
                return {
                  label: item.name,
                  value: item.node_id
                }
              })
          }
        }
      },
      {
        label: '起止时间',
        prop: 'date',
        use: 'label',
        placeholder: '请输入内容字数限制30字内',
        size: 'small',
        style: 'color: #5A5E66;margin: 0px 10px;margin-top: 5px;line-height: 20px',
        maxlength: 30,
        'show-word-limit': true
      },
      {
        label: '标题',
        prop: 'title',
        use: 'label',
        placeholder: '请输入内容字数限制30字内',
        size: 'small',
        style:
          'color: #5A5E66;margin: 0px 10px;margin-top: 5px;line-height: 20px',
        maxlength: 30,
        'show-word-limit': true
        // required: true
      },
      {
        label: '活动地点',
        prop: 'address',
        use: 'label',
        placeholder: '请输入内容字数限制30字内',
        size: 'small',
        style: 'color: #5A5E66;margin: 0px 10px;margin-top: 5px;line-height: 20px',
        maxlength: 30,
        'show-word-limit': true
        // required: true
      },
      {
        label: '封面',
        prop: 'image',
        use: 'image',
        placeholder: '请输入内容',
        preview: true,
        style: 'color: #5A5E66;margin: 8px 10px;line-height: 20px',
        size: 'small',
        assert: 'infomanage'
        // required: true
      },
      {
        label: '详情',
        prop: 'content',
        style:
          'color: #5A5E66;margin: -8px 11px;line-height: 20px;width: 800px;',
        use: 'html'
      }
    ],
    layout: {
      use: 'inline',
      gutter: 20,
      direction: 'column'
    }
  },
  searcher: {
    forms: [],
    filter: false,
    searcher: false,
    data: {
      node_id: 0
    },
    layout: {
      use: 'inline'
    }
  }
}
