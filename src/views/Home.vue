<template>
	<el-container class="container">
		<!-- 侧边栏 -->
		<el-aside :width="isCollapse ? '64px' : '200px'">
			<div class="title">
				<img :src="systemData.logo" alt="Logo" width="24px" />
				<router-link to="/welcome" v-show="isName">{{ systemData.name }}</router-link>
			</div>
			<!-- 侧边菜单 -->
			<el-menu
				unique-opened
				background-color="#001529"
				text-color="#fff"
				active-text-color="#409EFF"
				:collapse="isCollapse"
				:collapse-transition="false"
				router
				:default-active="navUrl"
			>
				<!-- 一级菜单 -->
				<el-submenu :index="item.id + ''" v-for="item in treeMenuList" :key="item.id">
					<template slot="title">
						<i :class="iconsObj[item.id]"></i>
						<span>{{ item.name }}</span>
					</template>
					<!-- 二级菜单 -->
					<el-menu-item-group>
						<el-menu-item :index="'/' + menuUrlObj[subItem.id]" v-for="subItem in item.children" :key="subItem.id" @click="subNavPath(menuUrlObj[subItem.id])">
							{{ subItem.name }}
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-aside>
		<el-container>
			<!-- 头部 -->
			<el-header>
				<!-- 折叠菜单 -->
				<div class="dislpay-arrow">
					<a href="javascript:void(0);" @click="subCollapse"><i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i></a>
				</div>
				<!-- 右上角按钮组 -->
				<div class="btn-array">
					<el-button target="_blank" @click="toPath" type="primary" size="mini" icon="el-icon-s-promotion">前台首页</el-button>
					<el-button type="success" size="mini" icon="el-icon-refresh" @click="clear">清除缓冲</el-button>
					<el-button type="danger" size="mini" icon="el-icon-switch-button" @click="logout">退出登录</el-button>
				</div>
			</el-header>
			<el-main>
				<!-- 路由占位符 -->
				<router-view></router-view>
			</el-main>
			<!-- 底部 -->
			<el-footer>{{ systemData.copyright }}</el-footer>
		</el-container>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			// 系统详细信息
			systemData: {},
			// 树形菜单列表
			treeMenuList: [],
			// 当前菜单激活的index
			navUrl: '',
			//菜单列表icon图标
			iconsObj: {
				44: 'el-icon-s-custom',
				36: 'el-icon-user',
				25: 'el-icon-s-grid',
				23: 'el-icon-tickets',
				14: 'el-icon-setting',
				1: 'el-icon-user-solid',
				56: 'el-icon-s-promotion'
			},
			// 重定义菜单URL
			menuUrlObj: {
				15: 'system/system',
				17: 'system/security',
				19: 'system/switch',
				21: 'system/pass',
				8: 'group/list',
				2: 'admin/list',
				26: 'functional/pay',
				28: 'functional/sms',
				34: 'functional/thirdparty',
				31: 'functional/email',
				24: 'adminlog/list',
				43: 'user/buylog',
				37: 'user/list',
				45: 'owner/list',
				48: 'owner/withdraw/list',
				52: 'owner/audit/list',
				57: 'journey/list'
			},
			// 控制菜单的展开与折叠
			isCollapse: false,
			// 控制网站名称的显示与隐藏
			isName: true
		};
	},
	created() {
		// 调用菜单列表方法
		this.menuList();
		// 调用获取系统详细信息
		this.system();
	},
	methods: {
		/**
		 * 请求菜单列表数据
		 */
		async menuList() {
			const { data: res } = await this.$http.get('index/home');
			if (res.code !== 200) return;
			this.treeMenuList = res.data;
		},
		/**
		 * 当前菜单激活的index监听事件
		 * @param {Object} url 子菜单url
		 */
		subNavPath(url) {
			this.navUrl = url;
		},
		/**
		 * 监听菜单的展开与折叠事件
		 */
		subCollapse() {
			this.isCollapse = !this.isCollapse;
			this.isName = !this.isName;
		},
		/**
		 * 退出登录
		 */
		async logout() {
			const { data: res } = await this.$http.get('index/loginOut');
			if (res.code !== 200) return this.$message.error(res.msg);
			// 删除token
			sessionStorage.removeItem('token');
			this.$router.push('/login');
			this.$message.success(res.msg);
		},
		/**
		 * 跳转到前台
		 */
		toPath() {
			window.open(window.serverConfig.APP_INDEX_URL, '_blank');
		},
		/**
		 * 清除缓存
		 */
		async clear() {
			const { data: res } = await this.$http.get('index/clear');
			if (res.code !== 200) return this.$message.error(res.msg);
			this.$message.success(res.msg);
		},
		/**
		 * 获取系统详细信息
		 */
		async system() {
			const { data: res } = await this.$http.get('system');
			if (res.code !== 200) return this.$message.error(res.msg);
			this.systemData = res.data;
		}
	}
};
</script>

<style lang="less" scoped>
.el-container {
	height: 100%;
}
.el-aside {
	background-color: #001529;
}
.title {
	color: #fff;
	background-color: #002140;
	height: 64px;
	font-size: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 550;
	a {
		color: #fff;
		text-decoration: none;
	}
	img {
		margin-right: 5px;
		border-radius: 50%;
	}
}
.el-menu {
	border-right: none;
	overflow: hidden;
}
.el-header {
	background-color: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	display: flex;
	justify-content: space-between;
	z-index: 10;
	padding: 0 20px 0 0;
}
.el-main {
	background-color: #f0f2f5;
}
.el-footer {
	background-color: #f0f2f5;
	border-top: 1px solid #e8e8e8;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #999;
	font-size: 12px;
}
.dislpay-arrow {
	top: 0;
}
.dislpay-arrow a {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	font-size: 20px;
	width: 60px;
	height: 60px;
	text-decoration: none;
	color: #333;
}
.dislpay-arrow a:hover {
	text-decoration: none;
	background-color: #f9f9fa;
}
.btn-array {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
