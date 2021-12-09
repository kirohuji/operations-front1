import { deleteChildren } from '@/utils'
import { organizationService, dicmanageService } from './service'
import _ from 'lodash'
let node_id = []
export const strToNum = function(arr) {
  if (arr) {
    if (_.isNumber(arr)) {
      arr = String(arr)
    }
    const n_id = arr.split('/').map(item => Number(item))
    return n_id[n_id.length - 1]
  }
}
export const strToNum2 = function(arr) {
  if (arr) {
    if (_.isNumber(arr)) {
      arr = String(arr)
    }
    const n_id = arr.split('/').map(item => Number(item))
    return n_id
  }
}
export default {
  schema: [
    {
      isHide: () => true,
      label: '所属机构',
      prop: 'node_id',
      use: 'base-cascader',
      size: 'small',
      update: true,
      create: true,
      forms: {
        label: '所属单位',
        default: function() {
          if (this.store && this.store.searcher) {
            const data = this.store.searcher.data
            return Array.isArray(data.node_id) ? [data.node_id[0]] : 0
          }
        },
        required: true
      },
      searcher: {
        real: true
      },
      order: 1,
      props: {
        value: 'node_id',
        label: 'name',
        checkStrictly: false
      },
      options: function() {
        return {
          runner: organizationService.gettabtypedata.bind(organizationService),
          variables: {
            o_id: localStorage.getItem('selectedTab') - 1
          },
          immediate: true,
          onAfter: function(data) {
            // 如果没有默认值，就将返回数据列表中的第一项传到输入值中
            if (!this.innerValue && !this.$attrs.value) {
              this.$emit('input', data.length && [data[0].node_id])
            }
            // 实时请求
            this.dispatch('DataSearchForm', 'search')
          },
          callback: data => {
            node_id = deleteChildren(data.list)
            return node_id
          }
        }
      }
    },
    {
      prop: 'r_id',
      label: '角色编号',
      width: '100'
    },
    {
      label: '角色名称',
      prop: 'name',
      width: '300',
      forms: {
        use: 'input',
        type: 'input',
        placeholder: '卫健局',
        size: 'small',
        default: '',
        update: true,
        create: true,
        rules: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        required: true
      }
    },
    {
      isHide: () => true,
      label: '用户成员',
      prop: 'admin_arr',
      forms: {
        use: 'import',
        required: true,
        props: {
          value: 'user_id',
          label: 'name'
        },
        rules: [
          { required: true, message: '请添加用户成员', trigger: 'change' }
        ],
        multiple: true,
        size: 'small'
      }
    },
    {
      isHide: () => true,
      label: '发布账号',
      prop: 'pub_id',
      forms: {
        use: 'select',
        placeholder: '卫健局',
        size: 'small',
        'allow-create': true,
        async: true,
        update: true,
        create: true,
        filterable: true,
        children: {
          use: 'option',
          options: {
            runner: dicmanageService.gettabtypedata.bind(dicmanageService),
            variables: {
              c_id: 5
            },
            immediate: true,
            callback: data =>
              deleteChildren(data.list).map(item => {
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
      prop: 'describe',
      label: '角色描述',
      forms: {
        use: 'input',
        placeholder: '请输入内容',
        size: 'small',
        update: true,
        create: true
      }
    }
  ],
  table: {
    column: [
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
    layout: {
      use: 'inline',
      gutter: 20,
      direction: 'column'
    }
  },
  searcher: {
    forms: [
      {
        label: '角色搜索',
        prop: 'title',
        use: 'search',
        placeholder: '根据角色名称、编号搜索',
        size: 'small',
        order: 2
      }
    ],
    filter: false,
    searcher: false,
    create: '新建角色',
    data: {
      node_id: 0
    },
    layout: {
      use: 'inline'
    }
  }
}
