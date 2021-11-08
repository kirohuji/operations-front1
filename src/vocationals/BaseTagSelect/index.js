import { Select, Option, Tag } from 'element-ui'
import BaseDialog from '@/components/molecules/BaseDialog.vue'
import ManagerTable, { Store } from '@/components/template/ManagerTable'
import './style.scss'
import { service } from './service'
import _ from 'lodash'
import schema from './schema'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  thenable: {
    tableData() {
      return {
        target: 'table',
        runner: service.getmembertag.bind(service),
        variables() {
          return {
            status: 0
          }
        },
        callback: res => {
          return {
            data: res.list,
            total: res.total
          }
        },
        immediate: false
      }
    },
    more() {
      return {
        target: 'select.options',
        runner: service.getmembertag.bind(service),
        variables: {
          status: 1
        },
        callback: res => {
          const options = res.list.map(item => {
            return {
              name: item.name,
              key: item.key
            }
          })
          this.isloading = false
          this.bottomSelect = options
          return _.unionBy(this.select.options, this.value, 'key')
        },
        immediate: true
      }
    },
    getmembertagcount() {
      return {
        target: 'totalPersion',
        runner: service.getmembertagcount.bind(service),
        callback: res => {
          this.isloading = false
          return res.count
        },
        immediate: false
      }
    }
  },
  data() {
    return {
      totalPersion: 0,
      isloading: true,
      bottomSelect: [],
      // 选择组件
      select: {
        current: new Set(),
        options: []
      },
      // 以下都是和对话框相关的参数
      dialog: {
        mode: 'update',
        title: '新建用户',
        visible: false,
        class: 'users-dialog'
      },
      store: new Store(schema),
      table: {
        data: [],
        total: 0
      }
    }
  },
  computed: {
    // 底部显示更多的选项值
    showOptions() {
      // debugger
      return _.differenceBy(this.bottomSelect, this.select.current, 'key')
    },
    tags() {
      return this.select.current.map(item => item.key).join(',')
    }
  },
  watch: {
    value: _.throttle(function(val) {
      if (Array.isArray(val) && val.length) {
        // debugger
        this.$set(this.select, 'current', this.value)
        this.handleCount()
      }
    }, 500),
    // 每次更新选择的数据都会重新统计人数
    'select.current': {
      handler(val) {
        if (val.length) {
          this.isloading = true
          this.getmembertagcount.refresh({
            name: this.tags
          })
        }
      },
      deep: true
    }
  },
  methods: {
    handleSearch(payload) {
      this.tableData.refresh({
        title: [payload.title],
        ...payload
      })
    },
    handleDialogOpen() {
      this.store.table.selectData = this.select.current
      this.$refs.tableDialog.open()
      this.$nextTick(() => {
        // eslint-disable-next-line no-useless-call
        this.tableData.refresh.call(this.tableData, this.searcher)
      })
    },
    /** 底部标签选择事件 */
    selectTag(tag) {
      this.select.current.push(tag)
    },
    /** 每次切换都需要重新统计人数 */
    handleChange(tags) {},
    handleSubmit() {
      this.options = this.$refs.managerTable.getSelection().map(item => {
        return {
          key: item.key,
          name: item.name
        }
      })
      this.$set(
        this.select,
        'current',
        _.unionBy(this.select.current, this.options, 'key')
      )
      this.$set(
        this.select,
        'options',
        _.unionBy(this.select.options, this.options, 'key')
      )
      this.$refs.tableDialog.close()
    },
    /** 计算人数 */
    handleCount() {
      if (Array.isArray(this.value)) {
        this.isloading = true
        this.getmembertagcount.refresh({
          name: this.value.map(item => item.key).join(',')
        })
      }
    }
  },
  render() {
    return (
      <div>
        <div>
          {/** 选择器 */}
          <Select
            multiple
            placeholder='请选择'
            value-key='key'
            allow-create
            default-first-option
            vModel={this.select.current}
            {...{
              props: this.$attrs,
              on: {
                change: val => this.handleChange(val),
                ...this.$listeners
              }
            }}
          >
            {this.select.options.map((item, index) => (
              <Option key={index} label={item.name} value={item} />
            ))}
          </Select>
          <span class='tumori' v-loading={this.isloading}>
            预计{this.totalPersion}人
          </span>
        </div>
        {/** 从标签里选择 */}
        <div style='display:flex;align-items:center'>
          <span class='select_label'>选择标签</span>
          {this.showOptions.map((item, index) => (
            <div class='more' key={index}>
              <Tag
                type='info'
                size='small'
                style='cursor:pointer'
                onClick={() => this.selectTag(item)}
              >
                {item.name}
              </Tag>
              {index === 4 && <span class='none'>...</span>}
            </div>
          ))}
          <el-link
            type='primary'
            style='margin-left: 8px'
            onClick={() => this.handleDialogOpen()}
          >
            更多标签
          </el-link>
        </div>
        <BaseDialog
          ref='tableDialog'
          title='用户导入'
          isReturn={true}
          custom-class='tag-select-dialog'
          {...{
            scopedSlots: {
              footer: () => (
                <div class='footer'>
                  <el-button
                    size='medium'
                    onClick={() => this.$refs.tableDialog.close()}
                  >
                    取消
                  </el-button>
                  <el-button
                    type='primary'
                    size='medium'
                    onClick={() => this.handleSubmit()}
                  >
                    保存
                  </el-button>
                </div>
              )
            }
          }}
        >
          <ManagerTable
            ref='managerTable'
            store={this.store}
            data={this.table.data}
            total={this.table.total}
            dialog={this.dialog}
            onSearch={payload => this.handleSearch(payload)}
          />
        </BaseDialog>
      </div>
    )
  }
}
