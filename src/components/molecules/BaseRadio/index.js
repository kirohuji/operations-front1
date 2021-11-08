import { Radio } from 'element-ui'
export default {
  components: {
    Radio
  },
  props: ['value', 'label'],
  render() {
    return (
      <Radio
        {...{
          props: {
            label: this.value
          },
          on: this.$listenres
        }}
      >
        {this.label}
      </Radio>
    )
  }
}
