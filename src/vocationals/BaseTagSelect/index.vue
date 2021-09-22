<template>
  <div v-loading="isloading">
    <div>
      <el-select
        v-bind="$attrs"
        multiple
        placeholder="请选择"
        value-key="key"
        @remove-tag="handleCountByRemove"
        v-on="$listeners"
        @change="handleChange"
      >
        <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item" />
      </el-select>
      <span class="tumori">预计{{ totalPersion }}人</span>
    </div>
    <div style="display: flex; align-items: center">
      <span class="select_label">选择标签</span>
      <div v-for="(tag, index) in showOptions" :key="index" class="more">
        <el-tag type="info" size="small" style="cursor: pointer" @click="selectTag(tag)">{{ tag.name }}</el-tag>
        <span v-if="index === 4" class="none">...</span>
      </div>

      <el-link type="primary" style="margin-left: 8px" @click="handleDialogOpen">更多标签</el-link>
    </div>
    <!-- <el-button type="primary" style="margin-left: 8px" @click="$refs.formDialog.open()">导入</el-button> -->
    <BaseDialog ref="formDialog" title="选择对象" append-to-body :is-return="true">
      <Card style="padding: 14px; padding-bottom: 0">
        <DataSearchForm
          ref="dataSearchForm"
          mode="search"
          :forms="config.search"
          label-position="right"
          :context="page"
          style="justify-content: space-between"
          @search="() => tableData.refresh.call(tableData, searcher)"
        >
          <template v-slot:right>
            <div />
          </template>
        </DataSearchForm>
      </Card>
      <Card style="padding: 14px; padding-top: 0">
        <DataTable
          ref="table"
          v-loading="tableData.loading"
          v-bind="table"
          id-key="key"
          style="padding: 0"
          :no-page="true"
          @change="tableData.refresh.call(tableData, searcher)"
        />
      </Card>
      <template v-slot:footer>
        <div class="footer">
          <el-button size="medium" @click="$refs.formDialog.close()">取消</el-button>
          <el-button type="primary" size="medium" @click="handleSubmit">保存</el-button>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/molecules/BaseDialog.vue'
import DataTable from '@/components/organisms/DataTable'
import Card from '@/components/atoms/Card'
import { service } from './service'
import _ from 'lodash'
import config from './config'
export default {
  inject: ['page'],
  components: {
    Card,
    DataTable,
    DataSearchForm: () => import('@/components/organisms/DataSearchForm'),
    // DataSearchForm,
    BaseDialog
  },
  props: ['model'],
  data() {
    return {
      isFirst: true,
      removeOption: [],
      table: {
        selected: {},
        data: [],
        column: config.table
      },
      isloading: false,
      updated: true,
      key: 1,
      totalPersion: 0,
      hasSelectData: false,
      selectData: [],
      config: config,
      options: [],
      showOptions: [],
      value: '',
      defaultShowOpiton: []
    }
  },
  computed: {
    searcher() {
      return {
        ...this.$refs.table.pagination,
        ...this.$refs.dataSearchForm.model
      }
    }
  },
  watch: {
    '$attrs.value': {
      handler(val) {
        if (val && val.length) {
          console.log('计算人数')
          this.handleCount()
        }
      }
    }
  },
  mounted() {
    this.handleCount()
  },
  methods: {
    /** 计算人数 */
    handleCount() {
      if (Array.isArray(this.$attrs.value)) {
        this.isloading = true
        this.getmembertagcount.refresh({
          name: this.$attrs.value.map((item) => item.key).join(',')
        })
      }
    },
    handleCountByRemove(item) {
      const result = _.difference(this.$attrs.value, [item])
        .map((item) => item.key)
        .join(',')
      console.log(result)
      if (result.length) {
        this.getmembertagcount.refresh({
          name: result
        })
      } else {
        this.totalPersion = 0
      }
    },
    handleDialogOpen() {
      this.$refs.formDialog.open()
      this.$nextTick(() => {
        // eslint-disable-next-line no-useless-call
        this.tableData.refresh.call(this.tableData, this.searcher)
      })
    },
    handleSubmit() {
      this.options = this.$refs.table.multipleSelection.map((item) => {
        return {
          key: item.key,
          name: item.name
        }
      })
      this.selectTags(this.options)
      this.$refs.formDialog.close()
    },
    handleChange(tags) {
      const elements = tags.map((item) => item.key)
      this.removeOption = this.defaultShowOpiton.filter((item) => elements.includes(item.key))
      this.showOptions = _.difference(this.defaultShowOpiton, this.removeOption)
    },
    selectTag(tag) {
      this.options.filter((item, index) => {
        if (item.key === tag.key) {
          this.removeOption[index] = item
        }
      })
      const result = this.$attrs.value.concat([tag])
      this.$emit('input', result)

      this.showOptions = _.differenceBy(this.defaultShowOpiton, this.removeOption, 'key')
      // this.handleCount()
    },
    selectTags(tags) {
      this.removeOption = []
      const elements = tags.map((item) => item.key)
      this.options.filter((item) => {
        if (elements.includes(item.key)) {
          this.removeOption[_.findIndex(this.defaultShowOpiton, (o) => o.key === item.key)] = item
        }
      })
      this.$emit('input', tags)
      this.showOptions = _.differenceBy(this.defaultShowOpiton, this.removeOption, 'name')
      // this.handleCount()
    }
  },
  thenable: {
    getmembertagcount() {
      return {
        target: 'totalPersion',
        runner: service.getmembertagcount.bind(service),
        callback: (res) => {
          this.isloading = false
          this.$emit('tagSelect', res.count)
          this.model.tag_count = res.count
          return res.count
        },
        immediate: false
      }
    },
    more() {
      return {
        target: 'options',
        runner: service.getmembertag.bind(service),
        variables: {
          status: 1
        },
        callback: (res) => {
          const options = res.list.map((item) => {
            return {
              name: item.name,
              key: item.key
            }
          })
          this.showOptions = _.compact(options)
          this.defaultShowOpiton = _.compact(options)
          if (this.$attrs.value.length) {
            this.handleChange(this.$attrs.value)
            const elements = this.$attrs.value.map((item) => item.key)
            this.removeOption = []
            this.defaultShowOpiton.filter((item) => {
              if (elements.includes(item.key)) {
                this.removeOption[_.findIndex(this.defaultShowOpiton, (o) => o.key === item.key)] = item
              }
            })
          }
          return options
        },
        immediate: true
      }
    },
    tableData() {
      return {
        target: 'table',
        runner: service.getmembertag.bind(service),
        variables() {
          return {
            status: 0
          }
        },
        callback: (res) => {
          return {
            data: res.list,
            total: res.total,
            selectData: this.$attrs.value.map((item) => {
              if (typeof item === 'object') {
                return item
              } else {
                return {
                  key: item
                }
              }
            })
          }
        },
        immediate: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select_label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #333333;
}
.more {
  margin: 0 8px;
}
.tumori {
  margin-left: 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  color: #606266;
}
.none {
  margin-left: 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  color: #606266;
}
</style>
