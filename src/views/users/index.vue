<template>
  <div>
    <ManagerTable
      :key="typeKey"
      :store="store"
      :dialog="dialog"
      :data="store.table.data"
      :total="store.table.total"
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
import schema, { strToNum2 } from './schema'
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
        selected: {},
        current: {}
      },
      authorize: {
        rbac_node_list: [],
        member_node_list: [],
        admin_role_info: [[], []]
      },
      store: new Store(schema)
    }
  },
  thenable: {
    userInfoData() {
      return {
        target: 'store.forms.data',
        runner: service.findOne.bind(service),
        variables: function() {
          return {
            type: this.type
          }
        },
        callback: res => {
          return {
            ...res,
            node_id: strToNum2(res.node_id)
          }
        },
        immediate: false
      }
    },
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
  },
  methods: {
    handleCreate() {
      this.dialog.mode = 'create'
      this.dialog.title = '新建用户'
      this.dialog.visible = true
    },
    handleUpdate(row) {
      this.userInfoData
        .refresh({
          user_id: row.user_id
        })
        .then(() => {
          this.dialog.title = '编辑用户'
          this.dialog.visible = true
        })
    },
    handleSearch(payload) {
      this.tableData.refresh({
        ...this.handleSearchPayload(payload)
      })
    },
    handleRowPayload(payload) {
      payload.node_id = strToNum2(payload.node_id)
      return payload
    },
    handleSearchPayload(payload) {
      payload.node_id =
        payload.node_id && payload.node_id.length
          ? payload.node_id[payload.node_id.length - 1]
          : 0
      return payload
    },
    /** 启用还是禁用 */
    handleTrigger(row) {
      const payload = this.handleSearchPayload(this.store.searcher.data)
      service
        .delin({
          type: row.status === 'ban' ? 1 : 2,
          user_id: row.user_id,
          ...payload
        })
        .then(() => {
          this.$message.success('操作成功')
          this.tableData.refresh(payload)
        })
    },
    /**
     * 处理对话框的表单提交：
     * mode:
     *  1. update: 编辑
     *  2. insert: 新增
     * data: 表单数据
     */
    handleSubmit({ validate, data, mode }) {
      validate(valid => {
        if (!valid) {
          return
        }
        /** 格式化收到的数据 */
        data = this.handleSearchPayload(data)
        /** 格式化搜索栏 */
        const payload = this.handleSearchPayload(this.store.searcher.data)
        switch (mode) {
          case 'update':
            service
              .update({
                ...data,
                type: this.type
              })
              .then(() => {
                this.$message.success('编辑成功')
                this.tableData.refresh(payload)
              })
            break
          case 'insert':
            service
              .insert({
                ...data,
                type: this.type
              })
              .then(() => {
                this.$message.success('新建成功')
                this.tableData.refresh(payload)
              })
            break
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
