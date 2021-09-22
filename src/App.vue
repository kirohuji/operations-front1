<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { AuthService } from '@/modules/auth'
import { api } from '@/utils/http'
export default {
  name: 'App',
  created() {
    if (localStorage.getItem('token')) {
      const service = new AuthService({ api })
      service.getrbacnode().then(({ data }) => {
        console.log('/生成目录', data.list)
        this.$store
          .dispatch('permission/generateRoutes', data.list)
          .then(res => {
            console.log('res', res)
          })
      })
    }
  }
}
</script>
