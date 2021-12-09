import { deleteChildren } from '@/utils'
import { organizationService, roleService } from './service'
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
/** 前后端数据格式转换  */
export const getNodeId = nodeId =>
  Array.isArray(nodeId) ? nodeId[nodeId.length - 1] : strToNum(nodeId)
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
      label: '姓名',
      prop: 'name',
      width: '150',
      forms: {
        use: 'input',
        type: 'input',
        placeholder: '请输入内容',
        size: 'small',
        default: '',
        update: true,
        create: true,
        required: true,
        rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    },
    {
      label: '手机号',
      prop: 'phone',
      forms: {
        use: 'input',
        type: 'input',
        placeholder: '请输入内容',
        size: 'small',
        required: true,
        update: true,
        create: true,
        rules: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    },
    {
      isHide: () => true,
      label: '所属角色',
      prop: 'r_id',
      forms: {
        size: 'small',
        style: 'width: 598px;min-height:50px',
        formClass: 'test',
        class: 'radio-border-group',
        use: 'radio-group',
        update: true,
        create: true,
        watch: {
          node_id() {
            this.isRender = false
            this.loading = true
            this.$nextTick(() => {
              this.isRender = true
              this.functional()
              this.$forceUpdate()
            })
          }
        },
        children: function() {
          return {
            use: 'base-radio',
            options: {
              runner: roleService.find.bind(roleService),
              variables: function() {
                return {
                  type: localStorage.getItem('selectedTab'),
                  node_id: getNodeId(this.model.node_id)
                }
              },
              immediate: true,
              default: [],
              callback: data => {
                return data.list.map(item => {
                  return {
                    label: item.name,
                    value: item.r_id
                  }
                })
              }
            }
          }
        }
      }
    },
    {
      prop: 'remark',
      label: '备注',
      forms: {
        update: true,
        create: true,
        use: 'input',
        type: 'textarea',
        placeholder: '请输入内容',
        class: 'width-500-textarea',
        rows: 4,
        size: 'small'
      }
    },
    {
      prop: 'status',
      label: '状态',
      formatter: row => {
        switch (row.status) {
          case 'allow':
            return '在用'
          case 'ban':
            return '禁用'
        }
      }
    }
  ],
  table: {
    column: [
      {
        prop: 'operation',
        label: '操作',
        align: 'center',
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
        label: '用户搜索',
        prop: 'title',
        use: 'search',
        placeholder: '根据用户名称、编号搜索',
        size: 'small',
        order: 2
      }
    ],
    filter: false,
    searcher: false,
    create: '新建用户',
    data: {
      // node_id: 0
    },
    layout: {
      use: 'inline'
    }
  }
}
