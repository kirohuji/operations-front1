import './style.scss'
import emitter from 'element-ui/src/mixins/emitter'
import Card from '@/components/atoms/Card'
import { DataSearchForm, DataFormDialog, DataTable } from 'lourd-components'
import { Button } from 'element-ui'
export { default as Store } from './store'
export default {
  componentName: 'ManagerTable',
  name: 'ManagerTable',
  props: {
    store: {
      type: Object,
      required: true,
      default: () => { }
    },
    data: {
      type: Array,
      default: () => []
    },
    total: Number,
    dialog: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    Card,
    DataSearchForm,
    DataFormDialog,
    DataTable,
    Button
  },
  mixins: [emitter],
  provide() {
    return {
      store: this.store
    }
  },
  data() {
    return {
      currentRecord: null
    }
  },
  methods: {
    getSelection() {
      this.$refs.dataTable.getAllSelectionData()
      return this.$refs.dataTable.multipleSelectionAll
    },
    handleSelect(select) {
      this.currentRecord = select
    }
  },
  render() {
    return (
      <div class='manager-table'>
        <DataFormDialog
          ref='dialog'
          custom-class={`manager-dialog ${this.dialog?.class}`}
          {...{
            props: {
              ...this.dialog,
              form: this.store.forms,
              visible: this.dialog.visible
            },
            on: {
              'update:visible': val => (this.dialog.visible = val),
              ...this.$listeners
            },
            scopedSlots: {
              title: () => <div class='title'>{this.dialog.title}</div>
            }
          }}
        />
        <Card class='main-content-header'>
          <DataSearchForm
            {...{
              props: this.store.searcher,
              on: {
                'update:data': data =>
                  this.$emit('search', {
                    ...data,
                    limit: this.store.table.page.pageSize,
                    page: this.store.table.page.currentPage
                  })
              },
              scopedSlots: {
                right: () => this.store.searcher.create ? (
                  <Button
                    class='search-button'
                    type='primary'
                    size='small'
                    onClick={() => this.$emit('create')}
                  >
                    {this.store.searcher.create || '新建'}
                  </Button>
                ) : ''
              }
            }}
          />
        </Card>
        <Card class='main-content-body'>
          <DataTable
            ref='dataTable'
            {...{
              props: {
                ...this.store.table,
                data: this.data,
                total: this.total
              },
              on: {
                select: this.handleSelect,
                'select-all': this.handleSelect,
                change: () => {
                  this.$emit('search', {
                    ...this.store.searcher.data,
                    limit: this.store.table.page.pageSize,
                    page: this.store.table.page.currentPage
                  })
                },
                ...this.$listeners
              },
              scopedSlots: this.$scopedSlots
            }}
          />
        </Card>
      </div>
    )
  }
}
