<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>旅途管理</el-breadcrumb-item>
			<el-breadcrumb-item>旅途列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<div slot="header" class="clearfix">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="journeyList">
							<el-button slot="append" icon="el-icon-search" @click="journeyList"></el-button>
						</el-input>
					</el-col>
				</el-row>
			</div>
			<!-- 添加删除按钮组 -->
			<el-row><el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick()">删除</el-button></el-row>

			<!-- 列表表格 -->
			<el-table :data="journeyListData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="id" label="ID" width="55"></el-table-column>
				<el-table-column prop="start" label="出发地"></el-table-column>
				<el-table-column prop="end" label="目的地"></el-table-column>
				<el-table-column prop="user_id" label="发起用户ID"></el-table-column>
				<el-table-column prop="type" label="发起类型">
					<template slot-scope="scope">
						<span v-if="scope.row.type === '0'">旅客</span>
						<span v-else>车主</span>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" width="160">
					<template slot-scope="scope">
						{{ scope.row.create_time | date }}
					</template>
				</el-table-column>
				<el-table-column prop="deadline" label="截止时间" width="160">
					<template slot-scope="scope">
						<span class="dead-line">{{ scope.row.deadline | date }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.status === '0'">拼车中</el-tag>
						<el-tag type="warning" v-else-if="scope.row.status === '1'">旅途中</el-tag>
						<el-tag type="danger" v-else-if="scope.row.status === '2'">已满座</el-tag>
						<el-tag type="success" v-else-if="scope.row.status === '3'">未满座</el-tag>
						<el-tag type="danger" v-else-if="scope.row.status === '4'">出发失败</el-tag>
						<el-tag type="info" v-else-if="scope.row.status === '5'">已取消</el-tag>
						<el-tag type="success" v-else>已完成</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						<el-tooltip :enterable="false" effect="dark" content="详情" placement="top">
							<el-button type="success" icon="el-icon-view" size="mini" @click="query(scope.row.id)"></el-button>
						</el-tooltip>
						<el-tooltip :enterable="false" effect="dark" content="轨迹线" placement="top">
							<el-button type="primary" icon="el-icon-tickets" size="mini" @click="queryTime(scope.row.id)"></el-button>
						</el-tooltip>
						<el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
							<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(scope.row.id)"></el-button>
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

			<!-- 查看详情对话框 -->
			<el-dialog title="查看详情" :visible.sync="queryDialogVisible" width="40%">
				<!-- 主体信息 -->
				<el-form :model="queryForm" ref="queryFormRef" label-width="100px" class="form-text">
					<el-form-item label="发起用户ID:">
						<span>{{ queryForm.user_id }}</span>
					</el-form-item>
					<el-form-item label="出发地:">
						<span>{{ queryForm.start }}</span>
					</el-form-item>
					<el-form-item label="目的地:">
						<span>{{ queryForm.end }}</span>
					</el-form-item>
					<el-form-item label="发起类型:">
						<span v-if="queryForm.type === '0'">旅客发起</span>
						<span v-else>车主发起</span>
					</el-form-item>
					<el-form-item label="旅行人数:" v-if="queryForm.type === '0'">
						<span>{{ queryForm.trip }}</span>
					</el-form-item>
					<el-form-item label="可载人数:" v-if="queryForm.type === '1'">
						<span>{{ queryForm.sum }}</span>
					</el-form-item>
					<el-form-item label="拼车旅客ID:" v-if="queryForm.type === '1'">
						<span>{{ queryForm.current }}</span>
					</el-form-item>
					<el-form-item label="创建时间:">
						<span>{{ queryForm.create_time | date }}</span>
					</el-form-item>
					<el-form-item label="截止时间:">
						<span class="dead-line">{{ queryForm.deadline | date }}</span>
					</el-form-item>
					<el-form-item label="状态:">
						<span v-if="queryForm.status === '0'">拼车中</span>
						<span v-else-if="queryForm.status === '1'">旅途中</span>
						<span v-else-if="queryForm.status === '2'">已满座</span>
						<span v-else-if="queryForm.status === '3'">未满座</span>
						<span v-else-if="queryForm.status === '4'">出发失败</span>
						<span v-else-if="queryForm.status === '5'">已取消</span>
						<span v-else>已完成</span>
					</el-form-item>
				</el-form>
			</el-dialog>

			<!-- 轨迹对话框 -->
			<el-dialog title="轨迹线" :visible.sync="locusDialogVisible" width="20%" @close="locusClose">
				<div class="locus">
					<el-timeline>
						<el-timeline-item
							v-for="(activity, index) in locusData"
							:key="index"
							:icon="activity.icon"
							:type="activity.type"
							:timestamp="activity.id === 0 ? '出发地' : activity.status === '1' ? '已达到|' + activity.arrival_time : '未达到'"
						>
							{{ activity.content }}
						</el-timeline-item>
					</el-timeline>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 存放删除数据的ID
			deleteId: '',
			// 表格数据绑定
			journeyListData: [],
			// 查询参数
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
			// 查看详情对话框初始化
			queryDialogVisible: false,
			// 查看详情数据绑定对象
			queryForm: {},
			// 轨迹对话框初始化
			locusDialogVisible: false,
			// 轨迹表单数据绑定
			locusData: []
		};
	},
	created() {
		this.journeyList();
		// 回车进行搜索
		var self = this;
		document.onkeydown = function(e) {
			var key = window.event.keyCode;
			if (key === 13) {
				self.journeyList();
			}
		};
	},
	methods: {
		/**
		 * 选中数据事件监听
		 */
		handleSelectionChange(val) {
			// 定义临时数组
			var idArray = [];
			val.forEach(item => {
				idArray.push(item.id);
			});
			// 数组转字符串
			this.deleteId = idArray.join(',');
		},

		/**
		 * 获取列表数据
		 */
		async journeyList() {
			const { data: res } = await this.$http.get('journey/list', { params: this.queryInfo });
			if (res.code !== 200) return this.$message.error(res.msg);
			this.queryInfo.total = res.data.total;
			this.journeyListData = res.data.data;
		},

		/**
		 * 每页显示多少条信息监听事件
		 * @param {Object} val
		 */
		handleSizeChange(val) {
			this.queryInfo.per_page = val;
			// 刷新列表
			this.journeyList();
		},

		/**
		 * 当前页监听事件
		 * @param {Object} val
		 */
		handleCurrentChange(val) {
			this.queryInfo.current_page = val;
			// 刷新列表
			this.journeyList();
		},

		/**
		 * 删除
		 */
		deleteClick(id = '') {
			if (id !== '') {
				this.deleteId = id;
			}
			if (this.deleteId === '' || this.deleteId === undefined || this.deleteId == null) {
				return this.$message.warning('请选中需要删除的数据！');
			}
			// 确认消息
			this.$confirm('是否继续删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					// 发起请求
					const { data: res } = await this.$http.delete('journey/delete', { params: { id: this.deleteId } });
					if (res.code !== 200) return this.$message.error(res.msg);
					this.$message.success(res.msg);
					// 刷新列表
					this.journeyList();
				})
				.catch(() => {
					this.$message.info('已取消！');
					// 刷新列表
					this.journeyList();
				});
		},

		/**
		 * 打开查看详情对话框
		 */
		async query(id) {
			const { data: res } = await this.$http.get(`journey/query/${id}`);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.queryForm = res.data;
			this.queryDialogVisible = true;
		},

		/**
		 * 打开轨迹对话框
		 */
		async queryTime(id) {
			const { data: res } = await this.$http.get(`journey/timeLine/${id}`);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.locusData = res.data.data;
			this.locusDialogVisible = true;
		},

		/**
		 * 关闭轨迹对话框
		 */
		locusClose() {
			this.locusData = [];
		}
	}
};
</script>

<style lang="less" scoped>
.locus {
	display: flex;
	justify-content: center;
	align-items: center;
}
.dead-line {
	color: red;
}
</style>
