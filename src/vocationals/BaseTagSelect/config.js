export default {
  search: {
    col: 0,
    fields: [
      {
        label: '搜索',
        prop: 'title',
        component: 'search',
        placeholder: '根据居民分类关键词',
        size: 'small'
      }
    ]
  },
  table: [
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
  ]
}
