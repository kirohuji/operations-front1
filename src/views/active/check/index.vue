<template>
  <div
    v-loading="formDataFetch.loading"
    style="padding-bottom: 41px;padding-top:24px;padding-left:30px"
  >
    <DataForm ref="dataForm" :key="formKey" v-bind="form" />
    <el-form
      v-if="form.data && form.data.is_advanced === 1"
      class="QtCode"
      style="margin-left: 20px"
      inline
    >
      <el-form-item label="活动详情">
        <img :src="activeDetail.url" width="150" height="150">
        <div>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 8px"
            @click="handleDownload(activeDetail.url, '活动详情')"
          >下载</el-button>
        </div>
      </el-form-item>
      <el-form-item label="活动打开类型">
        <div style="display: flex;padding-top: 12px">
          <el-radio-group v-model="downloadTypeSelect" class="download-type">
            <el-radio
              v-for="(item, index) in activeType"
              :key="index"
              :label="item.activity_type"
              :disabled="!activeTypes.includes(item.activity_type)"
            >{{ item.name }}</el-radio>
          </el-radio-group>
        </div>
        <img :src="activityQrcode.url" width="150" height="150">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 115px;margin-top: 14px"
          @click="
            () => {
              handleDownload(activityQrcode.url, handleActiveTypesTitle())
            }
          "
        >下载</el-button>
      </el-form-item>
    </el-form>
    <div style="display: flex;justify-content: center;">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button @click="save(0)">存为草稿</el-button>
      <el-button type="primary" @click="save(1)">保存</el-button>
    </div>
  </div>
</template>

<script>
import { DataForm } from 'lourd-components'
import config from './schema'
import { service } from '../service'
import moment from 'moment'
import _ from 'lodash'
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
      activityQrcode: {
        url: ''
      },
      activeDetail: {
        url: ''
      },
      activeTypeUrl: '',
      formKey: 1,
      downloadTypeSelect: '',
      activeType: [],
      activeTypes: [],
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
  watch: {
    downloadTypeSelect() {
      this.activityQrcodeFetch.refresh({
        activity_type: this.downloadTypeSelect
      })
    }
  },
  created() {
    this.currentId = this.$route.params && this.$route.params.id
    if (Number(this.currentId) !== 0) {
      this.formDataFetch
        .refresh({
          i_id: this.currentId
        })
        .then(() => {
          this.activeTypes = this.form.data.activity_info.activity_type
            .split(',')
            .map(item => Number(item))
          this.formKey++
        })
    }
  },
  methods: {
    handleActiveTypesTitle() {
      return _.find(this.activeType, ['activity_type', this.downloadTypeSelect]).name
    },
    handleDownload(url, subTitle) {
      const imgUrl = url
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      if (window.navigator.msSaveOrOpenBlob) {
        var bstr = atob(imgUrl.split(',')[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(
          blob,
          this.form.data.title + subTitle + '-.' + 'png'
        )
      } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement('a')
        a.href = imgUrl
        a.setAttribute('download', this.form.data.title + subTitle)
        a.click()
      }
    },
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
    qrcodeFetch() {
      return {
        target: 'activeDetail',
        runner: service.getQRCode.bind(service),
        variables: function() {
          return {
            i_id: this.currentId
          }
        },
        callback: function(res) {
          return {
            url: res.base64_image
          }
        },
        immediate: false
      }
    },
    activityQrcodeFetch() {
      return {
        target: 'activityQrcode',
        runner: service.activityQRCode.bind(service),
        variables: function() {
          return {
            i_id: this.currentId
          }
        },
        callback: function(res) {
          return {
            url: res.base64_image
          }
        },
        immediate: false
      }
    },
    activeType() {
      return {
        target: 'activeType',
        runner: service.getHealthyActive.bind(service),
        callback: data => {
          return data.list
        },
        immediate: true
      }
    },
    formDataFetch() {
      return {
        target: 'form.data',
        runner: service.findOne.bind(service),
        // decide: function() {
        //   Number(this.currentId) !== 0
        // },
        callback: function(res) {
          if (res.is_advanced === 1) {
            this.qrcodeFetch.refresh()
            this.downloadType = res.activity_info.activity_type.split(',')
            this.downloadTypeSelect = Number(this.downloadType[0])
          }
          // debugger
          return {
            ...res,
            date: `${moment(res.s_time * 1000).format(
              'YYYY-MM-DD HH:mm'
            )}-${moment(res.e_time * 1000).format('YYYY-MM-DD HH:mm')}`
          }
        },
        immediate: false
      }
    }
  }
}
</script>
