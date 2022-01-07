<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>车主管理</el-breadcrumb-item>
			<el-breadcrumb-item>车主列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<div slot="header" class="clearfix">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="ownerList">
							<el-button slot="append" icon="el-icon-search" @click="ownerList"></el-button>
						</el-input>
					</el-col>
				</el-row>
			</div>

			<!-- 列表表格 -->
			<el-table :data="ownerListData" border style="width: 100%;">
				<el-table-column prop="id" label="ID" width="80"></el-table-column>
				<el-table-column prop="user" label="用户名" width="180"></el-table-column>
				<el-table-column prop="name" label="真实姓名"></el-table-column>
				<el-table-column prop="money" label="总余额(单位:元)"></el-table-column>
				<el-table-column prop="service" label="平台服务费(单位:%)"></el-table-column>
				<el-table-column prop="mobile" label="手机号码"></el-table-column>
				<el-table-column prop="create_time" label="创建时间">
					<template slot-scope="scope">
						{{ scope.row.create_time | date }}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status === '1'">正常</el-tag>
						<el-tag type="danger" v-else>封禁</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip :enterable="false" effect="dark" content="封禁" placement="top" v-if="scope.row.status === '1'">
							<el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="statusEdit(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip :enterable="false" effect="dark" content="解封" placement="top" v-else>
							<el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="statusEdit(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
							<el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
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

			<!-- 编辑对话框 -->
			<el-dialog title="编辑车主" :visible.sync="editDialogVisible" width="40%" @close="editFormClose">
				<!-- 主体信息 -->
				<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="form-text">
					<el-form-item label="用户名" prop="user"><el-input placeholder="请输入用户名" v-model="editForm.user" disabled></el-input></el-form-item>
					<el-form-item label="平台服务费" prop="service">
						<el-input placeholder="请输入平台服务费" v-model.number="editForm.service"></el-input>
						<template slot="append">
							%
						</template>
					</el-form-item>
					<el-form-item label="每公里收费" prop="km">
						<el-input placeholder="请输入每公里收费" v-model="editForm.km"></el-input>
						<template slot="append">
							元
						</template>
					</el-form-item>
					<el-form-item label="驾驶证" prop="patente_url">
						<!-- 驾驶证上传 -->
						<el-upload
							accept=".jpg,.jpeg,.png,.bmp"
							class="avatar-uploader"
							:action="updateUrl"
							:headers="headers"
							:show-file-list="false"
							:on-success="handleAvatarSuccessEditPatente"
							:before-upload="beforeAvatarUpload"
							name="image"
						>
							<img v-if="editForm.patente_url" :src="editForm.patente_url" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="行驶证" prop="registration_url">
						<!-- 行驶证上传 -->
						<el-upload
							accept=".jpg,.jpeg,.png,.bmp"
							class="avatar-uploader"
							:action="updateUrl"
							:headers="headers"
							:show-file-list="false"
							:on-success="handleAvatarSuccessEditRegistration"
							:before-upload="beforeAvatarUpload"
							name="image"
						>
							<img v-if="editForm.registration_url" :src="editForm.registration_url" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="车辆图片" prop="car_url">
						<!-- 车辆图片上传 -->
						<el-upload
							accept=".jpg,.jpeg,.png,.bmp"
							class="avatar-uploader"
							:action="updateUrl"
							:headers="headers"
							:show-file-list="false"
							:on-success="handleAvatarSuccessEditCar"
							:before-upload="beforeAvatarUpload"
							name="image"
						>
							<img v-if="editForm.car_url" :src="editForm.car_url" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="车牌号" prop="plate_number"><el-input placeholder="请输入车牌号" v-model="editForm.plate_number"></el-input></el-form-item>
					<el-form-item label="可载人数" prop="capacity"><el-input placeholder="请输入可载人数" v-model.number="editForm.capacity"></el-input></el-form-item>
					<el-form-item label="车辆颜色" prop="color"><el-input placeholder="请输入车辆颜色" v-model="editForm.color"></el-input></el-form-item>
					<el-form-item label="支付宝账户" prop="alipay"><el-input placeholder="请输入支付宝账户" v-model="editForm.alipay"></el-input></el-form-item>
					<el-form-item label="支付宝真实姓名" prop="alipay_name"><el-input placeholder="请输入支付宝真实姓名" v-model="editForm.alipay_name"></el-input></el-form-item>
					<el-form-item label="微信账户" prop="wxpay"><el-input placeholder="请输入微信账户" v-model="editForm.wxpay"></el-input></el-form-item>
					<el-form-item label="微信真实姓名" prop="wxpay_name"><el-input placeholder="请输入微信真实姓名" v-model="editForm.wxpay_name"></el-input></el-form-item>
					<el-form-item label="银行卡号" prop="bank_card"><el-input placeholder="请输入银行卡号" v-model="editForm.bank_card"></el-input></el-form-item>
					<el-form-item label="银行卡姓名" prop="bank_card_name"><el-input placeholder="请输入银行卡姓名" v-model="editForm.bank_card_name"></el-input></el-form-item>
					<el-form-item label="银行卡类型" prop="bank_card_type">
						<el-input placeholder="请输入银行卡类型（如：中国农业银行）" v-model="editForm.bank_card_type"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitEdit">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 车主列表数据绑定
			ownerListData: [],
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
			// 编辑表单数据绑定
			editForm: {},
			// 编辑对话框初始化
			editDialogVisible: false,
			// 编辑表单验证规则
			editFormRules: {
				service: [{ required: true, message: '请输入平台服务费', trigger: 'blur' }, { type: 'number', message: '可载人数只能是数字', trigger: 'blur' }],
				km: [{ required: true, message: '请输入每公里收费', trigger: 'blur' }],
				patente_url: [{ required: true, message: '请输入上传驾驶证', trigger: 'change' }],
				registration_url: [{ required: true, message: '请输入上传行驶证', trigger: 'change' }],
				car_url: [{ required: true, message: '请输入上传车辆图片', trigger: 'change' }],
				plate_number: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
				capacity: [{ required: true, message: '请输入可载人数', trigger: 'blur' }, { type: 'number', message: '可载人数只能是数字', trigger: 'blur' }],
				color: [{ required: true, message: '请输入车辆颜色', trigger: 'blur' }],
				status: [{ required: true, message: '请选择状态', trigger: 'change' }]
			},
			// 上传图片URL
			updateUrl: window.serverConfig.BASE_API + 'base/upload',
			// 图片上传请求头
			headers: {
				Authorization: window.sessionStorage.getItem('token')
			}
		};
	},
	created() {
		this.ownerList();
		// 回车进行搜索
		var self = this;
		document.onkeydown = function(e) {
			var key = window.event.keyCode;
			if (key === 13) {
				self.ownerList();
			}
		};
	},
	methods: {
		/**
		 * 获取列表信息
		 */
		async ownerList() {
			const { data: res } = await this.$http.get('owner/list', { params: this.queryInfo });
			if (res.code !== 200) return this.$message.error(res.msg);
			this.queryInfo.total = res.data.total;
			this.ownerListData = res.data.data;
		},

		/**
		 * 编辑对话框
		 */
		async editDialog(id) {
			const { data: res } = await this.$http.get(`owner/query/${id}`);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.editForm = res.data;
			// 显示编辑对话框
			this.editDialogVisible = true;
		},

		/**
		 * 编辑对话框提交
		 */
		submitEdit() {
			this.$refs.editFormRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.put('owner/edit', this.editForm);
				if (res.code !== 200) return this.$message.error(res.msg);
				this.$message.success(res.msg);
				// 关闭对话框
				this.editDialogVisible = false;
				// 刷新列表
				this.ownerList();
			});
		},

		/**
		 * 每页显示多少条信息监听事件
		 * @param {Object} val
		 */
		handleSizeChange(val) {
			this.queryInfo.per_page = val;
			// 刷新列表
			this.ownerList();
		},

		/**
		 * 当前页监听事件
		 * @param {Object} val
		 */
		handleCurrentChange(val) {
			this.queryInfo.current_page = val;
			// 刷新列表
			this.ownerList();
		},

		/**
		 * 状态变更
		 * @param {Object} row 变更数据
		 */
		statusEdit(row) {
			// 确认消息
			this.$confirm('是否继续变更状态?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					let status = '1';
					if (row.status === '1') {
						status = '0';
					}
					// 发起请求
					const { data: res } = await this.$http.put('owner/status', { id: row.id, status: status });
					if (res.code !== 200) return this.$message.error(res.msg);
					this.$message.success(res.msg);
					// 刷新列表
					this.ownerList();
				})
				.catch(() => {
					this.$message.info('已取消！');
					// 刷新列表
					this.ownerList();
				});
		},

		/**
		 * 编辑对话框关闭
		 */
		editFormClose() {
			// 重置所有表单项
			this.$refs.editFormRef.resetFields();
		},

		/**
		 * 编辑驾驶证上传成功时的钩子
		 * @param {Object} res 返回数据
		 * @param {Object} file 文件对象
		 */
		handleAvatarSuccessEditPatente(res, file) {
			if (res.code !== 200) return this.$message.error(res.msg);
			this.editForm.patente_url = res.data[0];
			this.$message.success(res.msg);
		},

		/**
		 * 编辑行驶证上传成功时的钩子
		 * @param {Object} res 返回数据
		 * @param {Object} file 文件对象
		 */
		handleAvatarSuccessEditRegistration(res, file) {
			if (res.code !== 200) return this.$message.error(res.msg);
			this.editForm.registration_url = res.data[0];
			this.$message.success(res.msg);
		},

		/**
		 * 编辑车辆图片上传成功时的钩子
		 * @param {Object} res 返回数据
		 * @param {Object} file 文件对象
		 */
		handleAvatarSuccessEditCar(res, file) {
			if (res.code !== 200) return this.$message.error(res.msg);
			this.editForm.car_url = res.data[0];
			this.$message.success(res.msg);
		},

		/**
		 * 上传文件之前的钩子
		 * @param {Object} file 上传的文件
		 */
		beforeAvatarUpload(file) {
			const isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isImage) {
				this.$message.error('上传的图片只能是 JPG JPEG PNG BMP格式!');
			}
			if (!isLt10M) {
				this.$message.error('上传图片大小不能超过 10MB!');
			}
			return isImage && isLt10M;
		}
	}
};
</script>

<style lang="less" scoped></style>
