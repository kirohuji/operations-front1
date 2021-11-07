<template>
  <div>
    <ManagerTable
      :key="typeKey"
      :store="store"
      :dialog="dialog"
      :data="table.data"
      :total="table.total"
      @search="handleSearch"
    >
      <template v-slot:right>
        <el-button
          type="primary"
          @click="$router.push(`/information/infomanage/create/${0}`)"
        >新建资讯</el-button>
      </template>
      <template v-slot:title="{ row }">
        <span style="color:#008DFF">{{ row.title }}</span>
      </template>
      <template v-slot:status="{ row }">
        <el-tag v-if="row.status === 0" type="warning">草稿</el-tag>
        <el-tag v-else-if="row.status === 1" type="success">上线中</el-tag>
        <el-tag v-else-if="row.status === 2" type="info">已下架</el-tag>
      </template>
      <template v-slot:operation="{ row }">
        <div style="display: flex;justify-content: space-between;">
          <router-link :to="`/information/infomanage/edit/${row.i_id}`">
            <el-link type="primary">编辑</el-link>
          </router-link>
          <el-link
            :type="row.status !== 2 || row.status !== 0 ? 'primary' : ''"
            :disabled="row.status === 2 || row.status === 0"
            @click="handleSetPull(row)"
          >下架</el-link>
          <el-link
            type="primary"
            @click="$router.push(`/information/infomanage/check/${row.i_id}`)"
          >查看</el-link>
          <el-link type="primary" @click="handleCopy(row)">复制</el-link>
          <el-link type="primary" @click="handleDelete(row)">删除</el-link>
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
        title: '新建资讯',
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
  computed: {
    types() {
      return this.$store.getters.selectedTab
    }
  },
  thenable: {
    tableData() {
      return {
        target: 'table',
        runner: service.find.bind(service),
        variables: function() {
          return {
            types: this.types
          }
        },
        callback: res => {
          return {
            data: res.list,
            total: res.total
          }
        },
        immediate: true
      }
    }
  },
  methods: {
    handleDelete(row) {
      this.$confirm('删除内容不可回复，确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.remove(row).then(res => {
            this.$message.success('删除成功')
            this.tableData.refresh(this.searcher)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
