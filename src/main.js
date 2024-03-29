import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 请求拦截器和响应器
import './utils/request.js'
// 时间过滤器
import './utils/filter.js'
// 加载MD5加密算法
import md5 from 'js-md5';
// 挂载到vue原型上
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
