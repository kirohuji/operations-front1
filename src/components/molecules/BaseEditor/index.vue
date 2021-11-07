<template>
  <Tinymce ref="editor" v-bind="$attrs" :height="400" menubar="" width="1000" />
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'CreateArticle',
  components: { Tinymce }
}
</script>

<style></style>
