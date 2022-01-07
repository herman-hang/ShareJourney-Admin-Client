import Vue from 'vue'
import VueRouter from 'vue-router'
//路由赖加载
const Login = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
const Home = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
const Welcome = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')
const System = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/System.vue')
const Security = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/Security.vue')
const Switch = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/Switch.vue')
const Pass = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/Pass.vue')
const GroupList = () => import( /*webpackChunkName: "group"*/ '../views/group/List.vue')
const AdminList = () => import( /*webpackChunkName: "admin"*/ '../views/admin/List.vue')
const Pay = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Pay.vue')
const Sms = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Sms.vue')
const Thirdparty = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Thirdparty.vue')
const Email = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Email.vue')
const AdminLog = () => import( /*webpackChunkName: "adminlog"*/ '../views/adminlog/List.vue')
const User = () => import( /*webpackChunkName: "list_buylog"*/ '../views/user/BuyLog.vue')
const UserList = () => import( /*webpackChunkName: "list_buylog"*/ '../views/user/List.vue')
const OwnerList = () => import( /*webpackChunkName: "list_buylog"*/ '../views/owner/List.vue')
const AuditList = () => import( /*webpackChunkName: "audit_list"*/ '../views/owner/AuditList.vue')
const WithdrawList = () => import( /*webpackChunkName: "withdraw_list"*/ '../views/owner/WithdrawList.vue')
const JourneyList = () => import( /*webpackChunkName: "journey_list"*/ '../views/journey/List.vue')
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
		path: '/home',
		component: Home,
		redirect: '/welcome',
		children: [{
			path: '/welcome',
			component: Welcome
		}, {
			path: '/system/system',
			component: System
		}, {
			path: '/system/security',
			component: Security
		}, {
			path: '/system/switch',
			component: Switch
		}, {
			path: '/system/pass',
			component: Pass
		}, {
			path: '/group/list',
			component: GroupList
		}, {
			path: '/admin/list',
			component: AdminList
		}, {
			path: '/functional/pay',
			component: Pay
		}, {
			path: '/functional/sms',
			component: Sms
		}, {
			path: '/functional/thirdparty',
			component: Thirdparty
		}, {
			path: '/functional/email',
			component: Email
		}, {
			path: '/adminlog/list',
			component: AdminLog
		}, {
			path: '/user/buylog',
			component: User
		}, {
			path: '/user/list',
			component: UserList
		}, {
			path: '/owner/list',
			component: OwnerList
		}, {
			path: '/owner/audit/list',
			component: AuditList
		}, {
			path: '/owner/withdraw/list',
			component: WithdrawList
		}, {
			path: '/journey/list',
			component: JourneyList
		}]
	},
	{
		path: '/404',
		component: Error404
	}
	/*, {
			path: '*',
			redirect: '/404'
		} */
]

const router = new VueRouter({
	mode: 'hash',
	routes
})
//判断登录状态，挂载路由导航守卫 to:将要访问的路径  from:从那个路径跳转而来  next:放行
router.beforeEach((to, from, next) => {
	//获取token
	const token = window.sessionStorage.getItem('token');
	if (to.path === '/login') {
		//存在token直接重定向到后台首页
		if (token) {
			return next('/welcome');
		}
		return next();
	}
	if (!token) {
		if (to.path !== '/404') {
			return next('/login');
		}
	}
	next();
});
export default router
