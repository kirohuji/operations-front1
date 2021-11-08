export default {
  schema: [],
  table: {
    column: [
      {
        type: 'selection',
        width: '55'
      },
      {
        prop: 'name',
        label: '居民分类'
      },
      {
        prop: 'count',
        label: '人数'
      }
    ],
    data: [],
    total: 0,
    idKey: 'key',
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
        label: '搜索',
        prop: 'title',
        use: 'search',
        placeholder: '根据居民分类关键词',
        size: 'small'
      }
    ],
    filter: false,
    searcher: false,
    // create: '新建用户',
    data: {
      node_id: 0
    },
    layout: {
      use: 'inline'
    }
  }
}
