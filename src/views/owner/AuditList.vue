<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>车主管理</el-breadcrumb-item>
			<el-breadcrumb-item>车主审核列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<div slot="header" class="clearfix">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="auditList">
							<el-button slot="append" icon="el-icon-search" @click="auditList"></el-button>
						</el-input>
					</el-col>
				</el-row>
			</div>
			<!-- 列表表格 -->
			<el-table :data="auditListData" border style="width: 100%;">
				<el-table-column prop="id" label="ID" width="80"></el-table-column>
				<el-table-column prop="user" label="用户名" width="180"></el-table-column>
				<el-table-column prop="name" label="真实姓名"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="service" label="平台服务费(单位:%)"></el-table-column>
				<el-table-column prop="age" label="年龄"></el-table-column>
				<el-table-column prop="mobile" label="手机号码"></el-table-column>
				<el-table-column prop="km" label="每公里收费(单位:元)"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" width="180">
					<template slot-scope="scope">
						{{ scope.row.create_time | date }}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态">
					<template slot-scope="scope">
						<el-tag type="info" v-if="scope.row.is_owner === '1'">审核中</el-tag>
						<el-tooltip placement="top" v-if="scope.row.is_owner === '3'">
							<div slot="content">原因：{{ scope.row.cause }}</div>
							<el-tag type="danger">已驳回</el-tag>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip :enterable="false" effect="dark" content="驳回" placement="top">
							<el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="reject(scope.row.uid)" v-loading.fullscreen.lock="loading"></el-button>
						</el-tooltip>
						<el-tooltip :enterable="false" effect="dark" content="审核" placement="top">
							<el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="auditDialog(scope.row.id)" v-loading.fullscreen.lock="loading"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.current_page"
				:page-sizes="[25, 30, 40, 50]"
				:page-size="queryInfo.per_page"
				layout="total, sizes, prev, pager, next, jumper"
				:total="queryInfo.total"
			></el-pagination>

			<!-- 审核对话框 -->
			<el-dialog title="车主审核" :visible.sync="auditDialogVisible" width="40%">
				<el-form :model="auditForm" ref="auditFormRef" label-width="120px" class="form-text">
					<el-form-item label="用户名:">
						<span>{{ auditForm.user }}</span>
					</el-form-item>
					<el-form-item label="平台服务费(%):">
						<span>{{ auditForm.service }}</span>
					</el-form-item>
					<el-form-item label="真实姓名:">
						<span>{{ auditForm.name }}</span>
					</el-form-item>
					<el-form-item label="身份证:">
						<span>{{ auditForm.card }}</span>
					</el-form-item>
					<el-form-item label="服务费(%):">
						<span>{{ auditForm.service }}</span>
					</el-form-item>
					<el-form-item label="每公里收费(元):">
						<span>{{ auditForm.km }}</span>
					</el-form-item>
					<el-form-item label="驾驶证:">
						<span><img :src="auditForm.patente_url" alt="驾驶证" width="50" height="50" @click="view('1')" /></span>
					</el-form-item>
					<el-form-item label="行驶证:">
						<span><img :src="auditForm.registration_url" alt="行驶证" width="50" height="50" @click="view('2')" /></span>
					</el-form-item>
					<el-form-item label="车辆图片:">
						<span><img :src="auditForm.car_url" alt="车辆图片" width="50" height="50" @click="view('3')" /></span>
					</el-form-item>
					<el-form-item label="车牌号:">
						<span>{{ auditForm.plate_number }}</span>
					</el-form-item>
					<el-form-item label="可载人数:">
						<span>{{ auditForm.capacity }}</span>
					</el-form-item>
					<el-form-item label="申请时间:">
						<span>{{ auditForm.create_time | date }}</span>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="auditDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="pass">通 过</el-button>
				</span>
			</el-dialog>

			<!-- 图片预览 -->
			<el-dialog title="车主审核" :visible.sync="imageDialogVisible" width="40%"><img :src="imageUrl" width="100%" height="600px" /></el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			//查询的参数
			queryInfo: {
				//搜索关键字
				keywords: '',
				//当前页码
				current_page: 1,
				//每页显示多少条数据
				per_page: 25,
				// 总页数
				total: 0
			},
			// 审核列表数据绑定
			auditListData: [],
			// loading加载
			loading: false,
			// 审核对话框初始化
			auditDialogVisible: false,
			// 审核表单数据绑定
			auditForm: {},
			// 图片预览对话框
			imageDialogVisible: false,
			// 图片URL
			imageUrl: ''
		};
	},
	created() {
		this.auditList();
		// 回车进行搜索
		var self = this;
		document.onkeydown = function(e) {
			var key = window.event.keyCode;
			if (key === 13) {
				self.auditList();
			}
		};
	},
	methods: {
		/**
		 * 每页显示多少条信息监听事件
		 * @param {Object} val
		 */
		handleSizeChange(val) {
			this.queryInfo.per_page = val;
			// 刷新列表
			this.auditList();
		},

		/**
		 * 当前页监听事件
		 * @param {Object} val
		 */
		handleCurrentChange(val) {
			this.queryInfo.current_page = val;
			// 刷新列表
			this.auditList();
		},
		/**
		 * 获取审核列表数据
		 */
		async auditList() {
			const { data: res } = await this.$http.get('owner/audit/list', { params: this.queryInfo });
			if (res.code !== 200) return this.$message.error(res.msg);
			this.queryInfo.total = res.data.total;
			this.auditListData = res.data.data;
		},

		/**
		 * 驳回操作
		 * @param {Object} id 用户ID
		 */
		reject(id) {
			this.$prompt('请输入驳回原因', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			})
				.then(async ({ value }) => {
					this.loading = true;
					// 发起请求
					const { data: res } = await this.$http.put('owner/audit/reject', { id: id, cause: value });
					if (res.code !== 200) return this.$message.error(res.msg);
					this.$message.success(res.msg);
					this.loading = false;
					// 刷新列表
					this.auditList();
				})
				.catch(() => {
					this.$message.info('已取消！');
				});
		},

		/**
		 * 审核对话框
		 */
		async auditDialog(id) {
			const { data: res } = await this.$http.get(`owner/audit/query/${id}`);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.auditForm = res.data;
			// 显示审核对话框
			this.auditDialogVisible = true;
		},

		/**
		 * 审核通过
		 * @param {Object} id 用户ID
		 */
		async pass() {
			this.loading = true;
			// 发起请求
			const { data: res } = await this.$http.put('owner/audit/pass', { id: this.auditForm.id });
			if (res.code !== 200) return this.$message.error(res.msg);
			this.$message.success(res.msg);
			this.loading = false;
			// 关闭对话框
			this.auditDialogVisible = false;
			// 刷新列表
			this.auditList();
		},

		/**
		 * 审核对话框关闭
		 */
		auditFormClose() {
			// 重置所有表单项
			this.$refs.auditFormRef.resetFields();
		},

		/**
		 * 图片预览
		 * @param {Object} type 图片类型
		 */
		view(type) {
			this.imageDialogVisible = true;
			switch (type) {
				case '1':
					this.imageUrl = this.auditForm.patente_url;
					break;
				case '2':
					this.imageUrl = this.auditForm.registration_url;
					break;
				case '3':
					this.imageUrl = this.auditForm.car_url;
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="less" scoped>
img {
	cursor: pointer;
}
</style>
