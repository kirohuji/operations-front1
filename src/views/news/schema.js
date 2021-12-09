import { deleteChildren } from '@/utils'
import { service } from './service'
import moment from 'moment'
export default {
  schema: [],
  table: {
    column: [
      {
        prop: 'i_id',
        label: '编号',
        width: '100'
      },
      {
        prop: 'c_name',
        label: '分类',
        width: '150',
        'show-overflow-tooltip': true
      },
      {
        prop: 'title',
        label: '标题名称'
        // width: '250'
      },
      {
        prop: 'status',
        label: '状态',
        width: '100'
      },
      {
        prop: 'object_arr',
        label: '目标对象',
        width: '120',
        formatter: row => {
          return row.object_arr.map(item => item?.name).join(',')
        }
      },
      {
        prop: 'tag_read_count',
        label: '已读人数/目标人数',
        width: '150',
        formatter: row => {
          return `${row.tag_read_count}/${row.tag_count}`
        }
      },
      {
        prop: 'tag_count',
        label: '阅读率',
        width: '120',
        formatter: row => {
          return `${(row.tag_read_count / row.tag_count) * 100}%`
        }
      },
      {
        prop: 'updated_at',
        label: '更新时间',
        width: '150',
        formatter: row => {
          return moment(row.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        prop: 'pub_name',
        label: '发布主体',
        width: '120'
      },
      {
        prop: 'admin_name',
        label: '操作人',
        width: '120'
      },
      {
        prop: 'operation',
        label: '操作',
        width: '200px'
      }
    ],
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
        label: '发布账号',
        prop: 'user',
        use: 'input',
        size: 'small',
        disabled: true,
        required: true,
        default: JSON.parse(localStorage.getItem('user')).publisher
      },
      {
        label: '分类',
        prop: 'node_id',
        required: true,
        size: 'small',
        use: 'radio-group',
        update: true,
        create: true,
        children: {
          use: 'base-radio',
          options: {
            runner: service.getcategorylist.bind(service),
            variables: {},
            immediate: true,
            default: [],
            callback: data => {
              return data.list.map(item => {
                // debugger
                return {
                  label: item.name,
                  value: item.node_id
                }
              })
            }
          }
        }
      },
      {
        label: '标题',
        prop: 'title',
        use: 'input',
        placeholder: '请输入内容字数限制30字内',
        size: 'small',
        maxlength: 30,
        style: 'width: 350px',
        'show-word-limit': true,
        rules: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        required: true
      },
      {
        label: '封面',
        prop: 'image',
        use: 'image',
        placeholder: '请输入内容',
        size: 'small',
        assert: 'infomanage',
        rules: [
          { required: true, message: '请添加图片', trigger: 'blur' },
          { required: true, message: '请添加图片', trigger: 'change' }
        ],
        required: true
      },
      {
        label: '编辑',
        prop: 'content',
        use: 'editor'
      },
      {
        label: '对象',
        prop: 'object_arr',
        use: 'tag-select',
        size: 'small'
      }
    ],
    layout: {
      use: 'inline',
      gutter: 20,
      direction: 'column'
    }
  },
  searcher: {
    forms: [
      {
        label: '消息搜索',
        prop: 'title',
        use: 'search',
        placeholder: '根据标题名称、编号搜索',
        size: 'small'
      },
      {
        label: '消息分类',
        prop: 'type',
        use: 'select',
        placeholder: '请选择消息分类',
        async: true,
        real: true,
        clearable: true,
        size: 'small',
        default: [],
        props: {
          value: 'node_id',
          label: 'name',
          checkStrictly: false
        },
        children: {
          use: 'option',
          options: {
            runner: service.getcategorylist.bind(service),
            variables: {},
            default: [],
            immediate: true,
            callback: data =>
              deleteChildren(data.list).map(item => {
                return {
                  value: item.node_id,
                  label: item.name
                }
              })
          }
        }
      },
      {
        label: '状态',
        prop: 'status',
        use: 'select',
        clearable: true,
        real: true,
        size: 'small',
        class: 'state',
        children: {
          use: 'option',
          options: [
            {
              label: '上线中',
              value: 1
            },
            {
              label: '草稿',
              value: 0
            },
            {
              label: '已下架',
              value: 2
            }
          ]
        }
      },
      {
        label: '日期',
        prop: 'date',
        use: 'date-picker',
        type: 'date',
        real: true,
        placeholder: '选择日期',
        'value-format': 'yyyy-MM-dd',
        format: 'yyyy-MM-dd',
        size: 'small'
      }
    ],
    filter: false,
    searcher: false,
    create: '新建消息',
    data: {
      node_id: 0
    },
    layout: {
      use: 'inline'
    }
  }
}
