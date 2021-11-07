<template>
  <div style="padding-bottom: 41px;padding-top:24px;padding-left:30px">
    <DataForm ref="dataForm" v-bind="form" />
    <div style="display: flex;justify-content: center;">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button @click="save(0)">存为草稿</el-button>
      <el-button type="primary" @click="save(1)">保存</el-button>
    </div>
  </div>
</template>

<script>
import { DataForm } from 'lourd-components'
import config from '../schema'
import { service } from '../service'
export default {
  inject: ['layout'],
  provide() {
    return {
      page: this
    }
  },
  components: {
    DataForm
  },
  data() {
    return {
      form: {
        forms: config.forms.forms,
        data: {},
        layout: {
          // 布局
          use: 'inline',
          gutter: 20,
          direction: 'column'
        }
      },
      currentId: null
    }
  },
  created() {
    this.currentId = this.$route.params && this.$route.params.id
    if (Number(this.currentId) !== 0) {
      this.formDataFetch.refresh()
    }
  },
  methods: {
    save(status) {
      this.form.content = window.tinymce.activeEditor.getContent()
      this.currentId = this.$route.params && this.$route.params.id
      if (Number(this.currentId) !== 0) {
        service
          .update({
            ...this.form.data,
            tag: this.form.data.object_arr.map(item => item.key).join(','),
            types: this.type,
            status
          })
          .then(res => {
            if (status === 0) {
              this.$message.success('存为草稿成功')
            } else if (status === 1) {
              this.$message.success('上架成功')
            }
            this.$router.go(-1)
          })
      } else {
        service
          .insert({
            ...this.form.data,
            tag: this.form.data.object_arr.map(item => item.key).join(','),
            types: this.type,
            status
          })
          .then(res => {
            if (status === 0) {
              this.$message.success('存为草稿成功')
            } else if (status === 1) {
              this.$message.success('上架成功')
            }
            this.$router.go(-1)
          })
      }
    }
  },
  thenable: {
    formDataFetch() {
      return {
        target: 'form',
        runner: service.findOne.bind(service),
        variables: function() {
          return {
            i_id: this.currentId
          }
        },
        callback: function(res) {
          return {
            data: res
          }
        },
        immediate: false
      }
    }
  }
}
</script>
