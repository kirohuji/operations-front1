<template>
  <CustomCascader v-model="model[$attrs.prop]" v-bind="$attrs" v-on="$listeners" @input="handleChagne">
    <!-- <template slot-scope="{ data }">
      <span @click="() => handleChange(data)">{{ data.name }}</span>
    </template> -->
  </CustomCascader>
</template>

<script>
import CustomCascader from './CustomCascader'
// import _ from 'lodash'
export default {
  components: { CustomCascader },
  // inheritAttrs: false,
  props: ['model'],
  methods: {
    handleChagne(item) {
      console.log('修改了item')
    }
  }
}
</script>

<style></style>
