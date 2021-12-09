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
      // 如果切换视角的时候有搜索栏
      if (this.store && this.store.searcher) {
        // 将所属机构制空，因为每个视角的所属机构不一样
        this.store.searcher.data.node_id = null
      }
      this.typeKey++
      this.$forceUpdate()
    }
  }
}
