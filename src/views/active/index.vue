<template>
  <div>
    <ManagerTable
      :key="typeKey"
      :store="store"
      :dialog="dialog"
      :data="store.table.data"
      :total="store.table.total"
      @search="handleSearch"
      @create="$router.push(`/information/active/create/${0}`)"
    >
      <template v-slot:title="{ row }">
        <span style="color:#008DFF">{{ row.title }}</span>
      </template>
      <template v-slot:status="{ row }">
        <el-tag v-if="row.status === 0" type="warning">草稿</el-tag>
        <el-tag
          v-else-if="row.status === 1 && handleStatusStart(row.s_time)"
          type="success"
        >未开始</el-tag>
        <el-tag
          v-else-if="row.status === 1 && handleStatusEnd(row.e_time)"
          type="info"
        >已经过期</el-tag>
        <el-tag v-else-if="row.status === 1" type="success">上线中</el-tag>
        <el-tag v-else-if="row.status === 2" type="info">已下架</el-tag>
      </template>
      <template v-slot:operation="{ row }">
        <div style="display: flex;justify-content: space-between;">
          <router-link :to="`/information/active/edit/${row.i_id}`">
            <el-link type="primary">编辑</el-link>
          </router-link>
          <el-link
            :type="row.status !== 2 || row.status !== 0 ? 'primary' : ''"
            :disabled="row.status === 2 || row.status === 0"
            @click="handleSetPull(row)"
          >下架</el-link>
          <el-link
            type="primary"
            @click="$router.push(`/information/active/check/${row.i_id}`)"
          >查看</el-link>
          <el-link type="primary" @click="enrollCheck(row)">报名详情</el-link>
          <el-link type="primary" @click="handleCopy(row)">复制</el-link>
          <el-link type="primary" @click="handleDelete(row)">删除</el-link>
        </div>
      </template>
    </ManagerTable>
    <BaseDialog ref="enrollTableDialog" title="报名详情">
      <EnrollTable :id="enrollId" :key="enrollId" ref="entrollTable" />
    </BaseDialog>
  </div>
</template>

<script>
import ManagerTable, { Store } from '@/components/template/ManagerTable'
import schema from './schema'
import { service } from './service'
import selectedTab from '@/mixins/selectedTab'
import BaseDialog from '@/components/molecules/BaseDialog'
import EnrollTable from './components/EnrollTable.vue'
import moment from 'moment'
export default {
  components: {
    ManagerTable,
    BaseDialog,
    EnrollTable
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
      enrollId: 1,
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
        target: 'store.table',
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
    enrollCheck(row) {
      this.enrollId = row.i_id
      window.i_id = row.i_id
      this.$refs.enrollTableDialog.open()
      // this.$refs.enrollTable.refresh()
    },
    handleStatusStart(date) {
      return date * 1000 > new Date()
    },
    handleStatusEnd(date) {
      return date * 1000 < new Date()
    },
    /** 下架 */
    handleSetPull(row) {
      if (
        !this.handleStatusStart(row.s_time) &&
        !this.handleStatusEnd(row.e_time)
      ) {
        this.$message.error('活动已经开始,无法下架')
        return
      }

      service.setpull(row).then(res => {
        this.$message.success('下架成功')
        this.tableData.refresh()
      })
    },
    /** 复制 */
    handleCopy(row) {
      this.$confirm('确定复制当前资讯内容并存为新的草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service
            .findOne({
              i_id: row.i_id
            })
            .then(async({ data }) => {
              delete data.i_id
              data.title = data.title + '(拷贝)'
              data.status = 0
              data.types = this.types
              data.tag = data.object_arr.map(item => item.key).join(',')
              data.e_time = moment(data.e_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              data.s_time = moment(data.s_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              service
                .getmembertagcount({
                  name: data.tag
                })
                .then(res => {
                  data.tag_count = res.data.count
                  service.insert(data).then(res => {
                    this.$message.success('复制成功')
                    this.tableData.refresh(this.searcher)
                  })
                })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消复制'
          })
        })
    },
    /** 删除 */
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
        s_date: payload.date && payload.date[0],
        e_date: payload.date && payload.date[1]
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
