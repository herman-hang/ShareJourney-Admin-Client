import Vue from 'vue'
import VueRouter from 'vue-router'
//路由赖加载
const Login = () => import( /* webpackChunkName: "login_home" */ '../views/Login.vue')
const Error404 = () => import( /* webpackChunkName: "error" */ '../views/404.vue')
Vue.use(VueRouter)

// 防止点击重复的路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
const routes = [{
	path: '/',
	redirect: '/login'
}, {
	path: '/login',
	component: Login
}, {
	path: '/404',
	component: Error404
}, {
	path: '*',
	redirect: '/404'
}]

const router = new VueRouter({
	mode: 'hash',
	routes
})

export default router
