<template>
  <div>
    <Card style="padding: 14px;padding-bottom: 0">
      <!-- <DataSearchForm
        ref="dataSearchForm"
        :forms="config.search.fields"
        label-position="right"
        style="justify-content: space-between;"
        mode="search"
        @search="() => tableData.refresh.call(tableData, searcher)"
      >
        <template v-slot:right>
          <div />
        </template>
      </DataSearchForm> -->
    </Card>
    <Card style="padding: 14px;padding-top: 0">
      <DataTable
        ref="table"
        v-loading="tableData.loading"
        v-bind="table"
        style="padding: 0"
        @change="tableData.refresh.call(tableData, searcher)"
      />
    </Card>
  </div>
</template>

<script>
import { DataTable } from 'lourd-components'
import Card from '@/components/atoms/Card'
import config from './config'
import { service } from './service'
export default {
  inject: ['layout'],
  components: {
    Card,
    DataTable
    // DataSearchForm
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      config: config,
      table: {
        selected: {},
        data: [],
        page: {
          layout: `total, sizes, prev, pager, next, jumper`,
          total: 100,
          'page-sizes': [10, 15, 30, 100],
          pageSize: 10,
          'current-page': 1,
          background: false
        },
        column: config.table
      }
    }
  },
  computed: {
    searcher() {
      return {
        limit: this.table.page.pageSize,
        page: this.table.page['current-page'],
        total: this.table.page.total
        // ...this.$refs.dataSearchForm.model
      }
    }
  },
  created() {
    this.tableData.refresh(this.searcher)
  },
  methods: {
    refresh() {
      this.tableData.refresh(this.searcher)
    }
  },
  thenable: {
    tableData() {
      return {
        target: 'table',
        runner: service.getJoinList.bind(service),
        variables: {
          i_id: this.id
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
  }
}
</script>

<style lang="scss" scoped>
::v-deep .color-header {
  th {
    padding: 0 0;
    background-color: rgba(229, 229, 229, 1);

    .cell {
      color: #333;
    }
  }

  td {
    border: 1px solid rgba(198, 198, 198, 1);
  }
  // border: 1px solid rgba(229, 229, 229, 1);
}
</style>
<style>
.state .el-select .el-input {
  height: 32px;
  line-height: 32px;
}
.el-form-item--medium .el-form-item__label {
  height: 32px;
  line-height: 32px;
}
.state .el-select .el-input__inner {
  height: 32px;
}
.state >>> .el-input--medium .el-input__inner {
  height: 50px;
}
</style>
