<template>
  <div>
    <el-select
      v-model="value"
      multiple
      collapse-tags
      placeholder="请选择"
      v-on="$listeners"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button
      type="primary"
      style="margin-left: 8px"
      @click="handleOpenDialog"
    >导入</el-button>
    <BaseDialog
      ref="tableDialog"
      title="用户导入"
      append-to-body
      :is-return="true"
      custom-class="import-form-dialog"
      @save="handleSave"
    >
      <ManagerTable
        ref="userTable"
        :store="store"
        :data="store.table.data"
        :total="store.table.total"
        :dialog="dialog"
        @search="handleSearch"
      />
    </BaseDialog>
  </div>
</template>

<script>
import ManagerTable, { Store } from '@/components/template/ManagerTable'
import schema from './schema'
import BaseDialog from '@/components/molecules/BaseDialog.vue'
import { service } from './service'
import _ from 'lodash'
export default {
  components: {
    BaseDialog,
    ManagerTable
  },
  props: ['value'],
  data() {
    return {
      dialog: {
        mode: 'update',
        title: '新建用户',
        visible: false,
        class: 'users-dialog'
      },
      initValue: [],
      store: new Store(schema),
      options: [],
      table: {
        data: [],
        total: 0
      }
    }
  },
  computed: {
    type() {
      return this.$store.getters.selectedTab
    }
  },
  mounted() {
    /** 初始化 */
    if (this.value) {
      this.options = this.value
      this.initValue = this.value
      this.$emit(
        'input',
        this.value.map(item => item.value)
      )
    }
  },
  methods: {
    handleSave() {
      // 获取选中的数据
      const newOptions = this.$refs.userTable.currentRecord.map(item => {
        return {
          value: item.user_id,
          label: item.name
        }
      })
      // 选中的数据生成options
      this.$set(this, 'options', _.unionBy(this.options, newOptions, 'value'))
      // 选中的数据提交到value
      this.$emit(
        'input',
        _.union(
          this.value,
          newOptions.map(item => item.value)
        )
      )
    },
    handleOpenDialog() {
      this.store.table.idKey = 'user_id'
      this.store.table.selectData = this.value.map(item => {
        return {
          user_id: item
        }
      })
      this.$refs.tableDialog.open()
    },
    handleSearch(payload) {
      this.tableData.refresh({
        ...payload,
        node_id:
          payload.node_id && payload.node_id.length
            ? payload.node_id[payload.node_id.length - 1]
            : '0'
      })
    }
  },
  thenable: {
    tableData() {
      return {
        target: 'store.table',
        runner: service.find.bind(service),
        variables: function() {
          return {
            type: this.type
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
    }
  }
}
</script>

<style lang="scss">
.el-select .el-tag__close.el-icon-close {
  right: -4px;
}
.el-dialog.import-form-dialog {
  width: 800px;
  .el-dialog__header .title {
    padding: 20px;
    text-align: center;
    font-size: 18px;
    color: #000000;
    border-bottom: 1px solid #ccd3d9;
  }
}
</style>
