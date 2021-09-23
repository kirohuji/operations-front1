import { deleteChildren } from '@/utils'
import { organizationService, dicmanageService } from './service'
let node_id = []
export default {
  schema: [
    {
      label: '序号',
      type: 'index'
    },
    {
      isHide: () => true,
      label: '所属机构',
      prop: 'node_id',
      use: 'base-cascader',
      size: 'small',
      update: false,
      create: true,
      forms: { label: '所属单位' },
      searcher: {
        // isReal: true
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
          initData: function(data) {
            debugger;
            return data.length && [data[0].node_id]
          },
          callback: data => {
            node_id = deleteChildren(data.list)
            return node_id
          }
        }
      }
    },
    {
      prop: 'label',
      label: '名称',
      forms: {
        use: 'input'
      },
      size: 'mini',
      edit: false
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
    data: {},
    layout: {
      use: 'inline'
    }
  }
}
