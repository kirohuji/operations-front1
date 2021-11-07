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
            :disabled="type == 1"
            @click="handleAuthorize(row)"
          >授权</el-link>
          <el-link
            type="primary"
            :disabled="type == 1"
            @click="handleUpdate(row)"
          >编辑</el-link>
          <el-link
            type="danger"
            :disabled="type == 1"
            @click="handleDelete(row)"
          >删除</el-link>
        </div>
      </template>
    </ManagerTable>
    <!-- 授权对话框 -->
    <BaseDialog
      ref="authorizeDialog"
      title="角色授权"
      width="200"
      class="authorizeDialog"
    >
      <AuthorizeLayout left="用户权限" right="居民权限">
        <template v-slot:left>
          <DataTree
            id="c_id"
            ref="rbacNodeList"
            :data="authorize.rbac_node_list"
            show-checkbox
            name="title"
            default-expand-all
            :default-checked-keys="authorize.admin_role_info[0]"
          />
        </template>
        <template v-slot:right>
          <DataTree
            id="node_id"
            ref="memberNodeList"
            :data="authorize.member_node_list"
            show-checkbox
            :default-checked-keys="authorize.admin_role_info[1]"
          />
        </template>
      </AuthorizeLayout>
      <template v-slot:footer>
        <div class="footer">
          <el-button @click="$refs.authorizeDialog.close()">取消</el-button>
          <el-button
            type="primary"
            @click="handleAuthorizeSubmit"
          >保存</el-button>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import ManagerTable, { Store } from '@/components/template/ManagerTable'
import DataTree from '@/components/organisms/DataTree'
import BaseDialog from '@/components/molecules/BaseDialog.vue'
import schema from './schema'
import { service } from './service'
import selectedTab from '@/mixins/selectedTab'
const AuthorizeLayout = ({ props: { left, right }, scopedSlots }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-evenly'
    }}
  >
    <div style='display: flex;align-items: baseline;'>
      <span>{left}</span>
      {scopedSlots.left && scopedSlots.left()}
    </div>
    <ElDivider direction='vertical' />
    <div style='display: flex;align-items: baseline;'>
      <span>{right}</span>
      {scopedSlots.right && scopedSlots.right()}
    </div>
  </div>
)
// import _ from 'lodash'
export default {
  components: {
    ManagerTable,
    DataTree,
    BaseDialog,
    AuthorizeLayout
  },
  mixins: [selectedTab],
  data() {
    return {
      dialog: {
        mode: 'update',
        title: '新建角色',
        visible: false,
        class: 'roles-dialog'
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
    authorizeData() {
      return {
        runner: service.getrbacrole.bind(service),
        variables: () => {
          return {
            type: this.type,
            r_id: this.r_id
          }
        },
        callback: res => {
          this.authorize = {
            rbac_node_list: res.rbac_node_list,
            member_node_list: res.member_node_list,
            admin_role_info:
              res.admin_role_info === ''
                ? [[], []]
                : JSON.parse(res.admin_role_info)
          }
          this.$refs.authorizeDialog.open()
        },
        immediate: false
      }
    },
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
    // 授权功能
    handleAuthorizeSubmit() {
      if (this.$refs.rbacNodeList.getCheckedKeys().length === 0) {
        this.$message.warning('请选择用户权限')
        return
      }
      if (this.$refs.memberNodeList.getCheckedKeys().length === 0) {
        this.$message.warning('请选择居民权限')
        return
      }
      service
        .setrbacrole({
          type: this.type,
          r_id: this.r_id,
          rbac_node_arr: this.$refs.rbacNodeList.getCheckedKeys(true).join(','),
          member_node_arr: this.$refs.memberNodeList
            .getCheckedKeys(true)
            .join(','),
          admin_role_info: JSON.stringify([
            this.$refs.rbacNodeList.getCheckedKeys(true),
            this.$refs.memberNodeList.getCheckedKeys(true)
          ])
        })
        .then(res => {
          this.$message.success('设置成功')
          // this.authorizeData.refresh()
          this.$refs.authorizeDialog.close()
        })
    },
    handleAuthorize(row) {
      this.table.selected = row
      this.authorizeData.refresh()
    },
    // 基本功能
    handleCreate() {
      this.dialog.mode = 'create'
      this.dialog.title = '新建角色'
      this.dialog.visible = true
    },
    handleUpdate() {
      this.dialog.mode = 'update'
      this.dialog.title = '编辑角色'
      this.dialog.visible = true
    },
    handleSearch(payload) {
      // debugger;
      // // console.log('search', payload)
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
.roles-dialog {
  width: 560px;
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
