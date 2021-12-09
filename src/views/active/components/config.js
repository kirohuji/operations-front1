// import { deleteChildren } from '@/utils'
import { service } from './service'
import moment from 'moment'
export default {
  search: {
    col: 0,
    fields: [
      {
        label: '搜索',
        prop: 'title',
        use: 'search',
        // isReal: true,
        placeholder: '检索姓名、手机号',
        size: 'small'
      },
      {
        label: '分组',
        prop: 'team',
        use: 'select',
        isReal: true,
        placeholder: '检索姓名、手机号',
        async: true,
        size: 'small',
        options: function(context) {
          return {
            runner: service.getGroup.bind(service),
            params: {
              i_id: window.i_id
            },
            callback: (data) => {
              return data.list.map((item) => {
                return {
                  label: item.team,
                  value: item.team
                }
              })
            }
          }
        }
      }
    ]
  },
  table: [
    {
      prop: 'name',
      label: '姓名',
      width: '120'
    },
    {
      prop: 'team',
      label: '组号'
    },
    {
      prop: 'phone',
      label: '手机号'
    },
    {
      prop: 'gender',
      label: '性别',
      width: '100',
      formatter: (row) => {
        return row.gender === '2' ? '女' : '男'
      }
    },
    {
      prop: 'age',
      label: '年龄'
    },
    {
      prop: 'created_at',
      label: '报名时间',
      formatter: (row) => {
        return moment(row).format('YYYY-MM-DD HH:mm')
      }
    }
  ]
}
