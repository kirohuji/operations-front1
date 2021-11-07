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
      @click="
        () => {
          $refs.tableDialog.open()
        }
      "
    >导入</el-button>
    <BaseDialog
      ref="tableDialog"
      title="用户导入"
      append-to-body
      :is-return="true"
      custom-class="import-form-dialog"
    >
      <ManagerTable
        :store="store"
        :data="table.data"
        :total="table.total"
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
  methods: {
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
        target: 'table',
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
