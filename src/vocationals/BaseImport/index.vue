<template>
  <div>
    <el-select v-bind="$attrs" multiple collapse-tags placeholder="请选择" v-on="$listeners">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-button
      type="primary"
      style="margin-left: 8px"
      @click="
        () => {
          $refs.formDialog.open()
          key++
        }
      "
    >导入</el-button>
    <BaseDialog ref="formDialog" title="用户导入" append-to-body :is-return="true">
      <Card style="padding: 14px;padding-bottom: 0">
        <DataSearchForm
          :key="key"
          ref="dataSearchForm"
          mode="search"
          :forms="config.search"
          label-position="right"
          :context="page"
          style="justify-content: space-between;"
          @search="() => tableData.refresh.call(tableData, searcher)"
        >
          <template v-slot:right>
            <div />
          </template>
        </DataSearchForm>
      </Card>
      <Card style="padding: 14px;padding-top: 0">
        <DataTable
          ref="table"
          v-loading="tableData.loading"
          v-bind="table"
          id-key="user_id"
          style="padding: 0"
          @change="tableData.refresh.call(tableData, searcher)"
        />
      </Card>
      <template v-slot:footer>
        <div class="footer">
          <el-button size="medium" @click="$refs.formDialog.close()">取消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="
              () => {
                handleSubmit()
              }
            "
          >保存</el-button>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog, { dialogVisibleMixin } from '@/components/molecules/BaseDialog.vue'
import DataTable from '@/components/organisms/DataTable'
import Card from '@/components/atoms/Card'
// import DataSearchForm from '@/components/organisms/DataSearchForm'

import config from './config'
import { service } from './service'
import _ from 'lodash'
export default {
  inject: ['page'],
  components: {
    Card,
    DataTable,
    DataSearchForm: () => import('@/components/organisms/DataSearchForm'),
    // DataSearchForm,
    BaseDialog
  },
  mixins: [dialogVisibleMixin],
  data() {
    return {
      config: config,
      updated: true,
      key: 1,
      hasSelectData: false,
      selectData: [],
      table: {
        selected: {},
        data: [],
        column: config.table
      },
      options: [],
      value: ''
    }
  },
  computed: {
    type() {
      return this.$store.getters.selectedTab
    },
    searcher() {
      return {
        ...this.$refs.table.pagination,
        ...this.$refs.dataSearchForm.model,
        node_id: Array.isArray(this.$refs.dataSearchForm.model.node_id)
          ? this.$refs.dataSearchForm.model.node_id[this.$refs.dataSearchForm.model.node_id.length - 1]
          : this.$refs.dataSearchForm.model.node_id
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.hasSelectData = false
        this.change()
      }
    }
  },
  mounted() {
    this.change()
  },
  thenable: {
    tableData() {
      return {
        target: 'table',
        runner: service.find.bind(service),
        variables: function() {
          return {
            type: this.type
          }
        },
        callback: (res) => {
          if (!this.hasSelectData) {
            this.hasSelectData = true
            return {
              data: res.list,
              total: res.total,
              selectData: this.$attrs.value.map((item) => {
                if (typeof item === 'object') {
                  return item
                } else {
                  return {
                    user_id: item
                  }
                }
              })
            }
          } else {
            return {
              data: res.list,
              total: res.total
            }
          }
        },
        immediate: false
      }
    }
  },
  methods: {
    change() {
      if (this.$attrs.value) {
        this.setData(
          this.$attrs.value.map((item) => {
            return {
              label: item[this.$attrs.props.label],
              value: item[this.$attrs.props.value]
            }
          })
        )
      }
    },
    setData(result) {
      this.$emit(
        'input',
        result.map((item) => item.value)
      )
      this.options = _.uniqBy(this.options.concat(result), function(o) {
        return o.value
      })
    },
    handleSubmit() {
      console.log(this.$refs.table.changePageCoreRecordData())
      const result = this.$refs.table.changePageCoreRecordData().map((item) => {
        return {
          label: item.name,
          value: item.user_id
        }
      })
      this.setData(result)
      this.$refs.formDialog.close()
    }
  }
}
</script>

<style>
.el-select .el-tag__close.el-icon-close {
    right: -4px;
}
</style>
