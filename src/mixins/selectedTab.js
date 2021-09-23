export default {
  data() {
    return {
      typeKey: 0
    }
  },
  computed: {
    type() {
      return this.$store.getters.selectedTab
    }
  },
  watch: {
    type() {
      this.typeKey++
      this.$forceUpdate()
    }
  }
}
