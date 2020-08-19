import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import { RouterMount } from 'uni-simple-router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

import config from './config'

Vue.config.productionTip = false
Vue.prototype.$config = config

ViewUI.Message.config({
	top: 50,
	duration: 3
})
ViewUI.Notice.config({
	top: 100,
	duration: 3
})
Vue.use(ViewUI)

App.mpType = 'app'

const app = new Vue({
	...App,
	router,
	store
})

//v1.3.5起 H5端 你应该去除原有的app.$mount(); 使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app, '#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif