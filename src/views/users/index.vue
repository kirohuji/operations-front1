<template>
  <div>
    <ManagerTable
      :key="typeKey"
      :store="store"
      :dialog="dialog"
      :data="table.data"
      :total="table.total"
      @submit="handleSubmit"
      @create="handleCreate"
      @update="handleUpdate"
      @search="handleSearch"
    >
      <template v-slot:operation="{ row }">
        <div style="display: flex;justify-content: space-around">
          <el-link
            type="primary"
            :disabled="row.disabled"
            @click="handleUpdate(row)"
          >编辑</el-link>
          <el-link
            type="primary"
            :disabled="row.disabled"
            @click="handleTrigger(row)"
          >{{ row.status === 'ban' ? '开启' : '禁用' }}</el-link>
        </div>
      </template>
    </ManagerTable>
  </div>
</template>

<script>
import ManagerTable, { Store } from '@/components/template/ManagerTable'
import schema from './schema'
import { service } from './service'
import selectedTab from '@/mixins/selectedTab'
export default {
  components: {
    ManagerTable
  },
  mixins: [selectedTab],
  data() {
    return {
      dialog: {
        mode: 'update',
        title: '新建用户',
        visible: false,
        class: 'users-dialog'
      },
      table: {
        data: [],
        total: 0
      },
      authorize: {
        rbac_node_list: [],
        member_node_list: [],
        admin_role_info: [[], []]
      },
      selected: {},
      store: new Store(schema)
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
  },
  methods: {
    // 基本功能
    handleCreate() {
      this.dialog.mode = 'create'
      this.dialog.title = '新建用户'
      this.dialog.visible = true
    },
    handleUpdate() {
      this.dialog.mode = 'update'
      this.dialog.title = '编辑用户'
      this.dialog.visible = true
    },
    handleSearch(payload) {
      this.tableData.refresh({
        ...payload,
        node_id:
          payload.node_id && payload.node_id.length
            ? payload.node_id[payload.node_id.length - 1]
            : '0'
      })
    },
    handleSubmit({ validate, data, mode }) {
      validate(valid => {
        if (!valid) {
          return
        }
      })
    }
  }
}
</script>

<style lang="scss">
.users-dialog {
  // width: 560px;
  .data-form {
    .el-input__inner {
      width: 250px;
    }
    .el-form-item__label {
      width: 80px;
    }
  }
}
</style>
