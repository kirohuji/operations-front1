import './style.scss'
// import _ from 'lodash'
export default {
  name: 'BaseActiveConfig',
  componentName: 'BaseActiveConfig',
  props: {
    model: Object
  },
  computed: {
    adv() {
      return this.model.adv
    }
  },
  data() {
    return {
      visible: false, // 选择活动类型显示
      type: 'diabetes',
      measure_num: 0,
      score: 0,
      date_type: 1,
      typeList: {
        diabetes: {
          activity_type: '1',
          measure_num: 0,
          score: 0,
          date_type: 7
        },
        hypertension: {
          activity_type: '2',
          measure_num: 0,
          score: 0,
          date_type: 1
        },
        healthCheck: {
          activity_type: ['3'],
          measure_num: 1,
          score: 0,
          date_type: 1,
          healthCheckType: '1'
        }
      }
    }
  },
  watch: {
    adv: {
      handler(val) {
        if (val.includes('活动类型')) {
          this.visible = true
        } else {
          this.visible = false
        }
      },
      immediate: true
    },
    type: {
      handler() {
        this.score = 0
        this.date_type = 1
        this.measure_num = 0
        console.log('type', this.getResult())
      }
    }
  },
  created() {
    if (this.model.activity_info) {
      const type = this.model.activity_info.activity_type.split(',')
      if (type.indexOf('1') !== -1) {
        this.typeList.diabetes = this.model.activity_info
        this.type = 'diabetes'
      } else if (type.indexOf('2') !== -1) {
        this.typeList.hypertension = this.model.activity_info
        this.type = 'hypertension'
      } else if (type.indexOf(',') !== -1) {
        this.type = 'healthCheck'
        this.typeList.healthCheck = {
          ...this.model.activity_info,
          activity_type: this.model.activity_info.activity_type.split(',')
        }
      } else if (
        type.indexOf('3') !== -1 ||
        type.indexOf('7') !== -1 ||
        type.indexOf('8') !== -1 ||
        type.indexOf('9') !== -1 ||
        type.indexOf('10') !== -1 ||
        type.indexOf('11') !== -1
      ) {
        this.type = 'healthCheck'
        this.typeList.healthCheck = {
          ...this.model.activity_info,
          activity_type: this.model.activity_info.activity_type.split(',')
        }
      }
    }
    this.$on('getResult', (cb) => {
      cb(this.getResult())
    })
  },
  methods: {
    getResult() {
      if (this.visible) {
        return {
          ...this.typeList[this.type]
        }
      } else {
        return {
        }
      }
    }
  },
  render() {
    return (
      <div>
        <el-checkbox-group
          {...{
            props: this.$attrs,
            on: this.$listeners
          }}
        >
          {this.$attrs.options.map((item, index) => (
            <el-checkbox key={index} label={item.label}>
              {item.label}
            </el-checkbox>
          ))}
        </el-checkbox-group>
        {this.visible && (
          <div class='active-config-items'>
            <el-radio-group v-model={this.type}>
              <div>
                <el-radio label='diabetes'>
                  糖尿病测量(
                  <span class='active-config-item' />
                  活动达标规则设置：一周完成有效测量
                  <el-input
                    size='mini'
                    class='dia'
                    vModel={this.typeList.diabetes.measure_num}
                    // readonly
                    maxlength='2'
                    disabled={this.type !== 'diabetes'}
                  />{' '}
                  次以上, 每次获得
                  <el-input
                    size='mini'
                    class='dia'
                    vModel={this.typeList.diabetes.score}
                    maxlength='2'
                    disabled={this.type !== 'diabetes'}
                  />
                  积分)
                </el-radio>
              </div>
              <div>
                <el-radio label='hypertension'>
                  高血压测量(
                  <span class='active-config-item' />
                  活动达标规则设置：一天完成有效测量
                  <el-input
                    size='mini'
                    class='dia'
                    vModel={this.typeList.hypertension.measure_num}
                    maxlength='2'
                    disabled={this.type !== 'hypertension'}
                  />{' '}
                  次以上, 每次获得
                  <el-input
                    size='mini'
                    class='dia'
                    vModel={this.typeList.hypertension.score}
                    maxlength='2'
                    disabled={this.type !== 'hypertension'}
                  />
                  积分)
                </el-radio>
              </div>
              <div>
                <el-radio label='healthCheck'>
                  健康打卡(
                  <span class='active-config-item' />
                  活动规则说明：每个打卡点每天至多打卡一次，打卡点个数根据实际设计情况, 每次获得{' '}
                  <el-input
                    size='mini'
                    class='dia'
                    vModel={this.typeList.healthCheck.score}
                    maxlength='2'
                    disabled={this.type !== 'healthCheck'}
                  />
                  积分)
                </el-radio>
              </div>
              {this.type === 'healthCheck' && (
                <div style='margin: 8px 80px'>
                  <el-checkbox-group vModel={this.typeList.healthCheck.activity_type}>
                  </el-checkbox-group>
                </div>
              )}
            </el-radio-group>
          </div>
        )}
      </div>
    )
  }
}
