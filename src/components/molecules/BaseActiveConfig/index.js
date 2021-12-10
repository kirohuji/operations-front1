import './style.scss'
import { BaseEnter } from 'lourd-components'
import _ from 'lodash'
import { service } from './service'
/** 健康打卡单选框 */
const HealthCheckRadio = {
  props: ['value', 'type', 'label', 'measure_num', 'score', 'activity_type'],
  data() {
    return {
      list: []
    }
  },
  thenable: {
    data() {
      return {
        target: 'list',
        runner: service.getHealthyActive.bind(service),
        callback: data => {
          return data.list
        },
        immediate: true
      }
    }
  },
  render() {
    return (
      <div>
        <div>
          <el-radio label='healthCheck'>
            健康打卡(
            <span class='active-config-item' />
            活动规则说明：每个打卡点每天至多打卡一次，打卡点个数根据实际设计情况,
            每次获得{' '}
            <el-input
              size='mini'
              class='dia'
              value={this.score}
              onInput={val => this.$emit('update:score', val)}
              maxlength='2'
              disabled={this.value !== this.type}
            />
            积分)
          </el-radio>
        </div>
        <div style='margin: 8px 80px'>
          <el-checkbox-group
            value={this.activity_type}
            disabled={this.value !== this.type}
            onInput={val => this.$emit('update:activity_type', val)}
          >
            {this.list.map(item => (
              <el-checkbox label={item.activity_type}>{item.name}</el-checkbox>
            ))}
          </el-checkbox-group>
        </div>
      </div>
    )
  }
}
/** 通用单选框 */
const ActiveTypeRadio = {
  name: 'ActiveTypeRadio',
  props: ['value', 'type', 'label', 'measure_num', 'score'],
  render() {
    return (
      <div>
        <el-radio label={this.type}>
          {this.label}(
          <span class='active-config-item' />
          活动达标规则设置：一周完成有效测量
          <el-input
            size='mini'
            class='dia'
            value={this.measure_num}
            onInput={val => this.$emit('update:measure_num', val)}
            // readonly
            maxlength='2'
            disabled={this.value !== this.type}
          />{' '}
          次以上, 每次获得
          <el-input
            size='mini'
            class='dia'
            value={this.score}
            onInput={val => this.$emit('update:score', val)}
            maxlength='2'
            disabled={this.value !== this.type}
          />
          积分)
        </el-radio>
      </div>
    )
  }
}
/** 活动类型 */
const ActiveType = {
  name: 'ActiveType',
  props: ['options', 'type'],
  render() {
    return (
      <div class='active-config-items'>
        <el-radio-group
          value={this.type}
          onInput={val => this.$emit('update:type', val)}
        >
          {this.options.map(item => {
            if (item.use === 'ActiveTypeRadio') {
              return (
                <ActiveTypeRadio
                  {...{
                    props: {
                      ...item,
                      value: this.type
                    },
                    on: {
                      'update:measure_num': val => (item['measure_num'] = val),
                      'update:score': val => (item['score'] = val)
                    }
                  }}
                />
              )
            }
            if (item.use === 'HealthCheckRadio') {
              return (
                <HealthCheckRadio
                  {...{
                    props: {
                      ...item,
                      value: this.type
                    },
                    on: {
                      'update:activity_type': val =>
                        (item['activity_type'] = val),
                      'update:score': val => (item['score'] = val)
                    }
                  }}
                />
              )
            }
          })}
        </el-radio-group>
      </div>
    )
  }
}
export default {
  name: 'BaseActiveConfig',
  componentName: 'BaseActiveConfig',
  props: ['value', 'options'],
  inject: ['form'],
  computed: {
    model() {
      return this.form.model
    },
    oldData() {
      return this.form.data
    },
    activeType() {
      return _.find(this.activeOptions, ['type', this.type])
    }
  },
  watch: {
    activeType: {
      handler(val) {
        // debugger
        if (val) {
          this.value.activity_type = {
            activity_type: Array.isArray(val.activity_type)
              ? val.activity_type.join(',')
              : val.activity_type,
            date_type: val.date_type,
            measure_num: val.measure_num,
            score: val.score
          }
        }
      },
      deep: true
    },
    'value.value'(val) {
      if (val === 1) {
        this.value.activity_type = {
          can_join: 1
        }
      } else if (val === 2) {
        this.value.activity_type = {
          is_sms: 1
        }
      }
    }
  },
  data: () => ({
    type: 'diabetes',
    activeOptions: [
      {
        use: 'ActiveTypeRadio',
        activity_type: '1',
        label: '糖尿病测量',
        type: 'diabetes',
        measure_num: 0,
        score: 0,
        date_type: 7
      },
      {
        use: 'ActiveTypeRadio',
        activity_type: '2',
        label: '高血压测量',
        type: 'hypertension',
        measure_num: 0,
        score: 0,
        date_type: 1
      },
      {
        use: 'HealthCheckRadio',
        label: '健康打卡',
        type: 'healthCheck',
        activity_type: [3],
        measure_num: 1,
        score: 0,
        date_type: 1,
        healthCheckType: '1'
      }
    ]
  }),
  mounted() {
    /** 非常复杂的初始化 */
    if (this.value.value === 3) {
      const types = this.value.activity_type.activity_type.split(',')
      if (_.some(types, o => Number(o) >= 3)) {
        this.activeOptions[2].date_type = this.value.activity_type.date_type
        this.activeOptions[2].measure_num = this.value.activity_type.measure_num
        this.activeOptions[2].score = this.value.activity_type.score
        this.type = this.activeOptions[2].type
        this.activeOptions[2].activity_type = types.map(item => Number(item))
      } else {
        for (let i = 0; i < this.activeOptions.length; i++) {
          const item = this.activeOptions[i]
          if (item.activity_type === this.value.activity_type.activity_type) {
            this.activeOptions[i].date_type = this.value.activity_type.date_type
            this.activeOptions[
              i
            ].measure_num = this.value.activity_type.measure_num
            this.activeOptions[i].score = this.value.activity_type.score
            this.type = this.activeOptions[i].type
            break
          }
        }
      }
    }
    if (this.oldData.can_join === 1) {
      this.value.value = 1
    } else if (this.oldData.is_sms === 1) {
      this.value.value = 2
    }
  },
  render() {
    return (
      <div>
        <BaseEnter
          use='radio-group'
          vModel={this.value.value}
          children={{
            use: 'base-radio',
            options: this.options
          }}
        />
        {/** 当选中活动类型时 */}
        {this.value.value === 3 && (
          <ActiveType
            options={this.activeOptions}
            ref='activeType'
            type={this.type}
            {...{
              on: {
                'update:type': val => (this.type = val)
              }
            }}
          />
        )}
      </div>
    )
  }
}
