import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import { BaseEnterProvider, ThenableProvider } from 'lourd-components'
import BaseCascader from '@/components/molecules/BaseCascader/cascader/src/cascader'
import BaseImport from '@/vocationals/BaseImport'
import BaseImageUpload from '@/vocationals/BaseImageUpload'
import BaseEditor from '@/components/molecules/BaseEditor'
import BaseRadio from '@/components/molecules/BaseRadio/index'
import BaseTagSelect from '@/vocationals/BaseTagSelect'
import App from './App'
import store from './store'
import router from './router'
import './icons'
import './permission'
import './utils/error-log' // error log

import * as filters from './filters'
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})
Vue.use(BaseEnterProvider)
Vue.prototype.$baseComponents['base-cascader'] = BaseCascader
Vue.prototype.$baseComponents['import'] = BaseImport
Vue.prototype.$baseComponents['image'] = BaseImageUpload
Vue.prototype.$baseComponents['editor'] = BaseEditor
Vue.prototype.$baseComponents['base-radio'] = BaseRadio
Vue.prototype.$baseComponents['tag-select'] = BaseTagSelect
Vue.use(ThenableProvider)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
