<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>功能配置</el-breadcrumb-item>
			<el-breadcrumb-item>短信配置</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<div slot="header" class="clearfix"><strong>短信配置</strong></div>
			<el-form :model="smsForm" :rules="smsFormRules" ref="smsFormRef" label-width="110px">
				<el-tabs v-model="activeName" tab-position="left">
					<el-tab-pane label="ThinkAPI短信" name="think">
						<el-form-item label="AppCode" prop="app_code"><el-input placeholder="请输入AppCode" v-model="smsForm.app_code"></el-input></el-form-item>
						<el-form-item label="签名ID" prop="sign_id"><el-input placeholder="请输入签名" v-model="smsForm.sign_id"></el-input></el-form-item>
						<el-form-item label="发送测试短信" prop="phone">
							<div class="test-send">
								<el-input placeholder="请输入测试的手机号码" v-model="smsForm.phone"></el-input>
								<el-button size="small" @click="testSend('think')">发送测试</el-button>
							</div>
						</el-form-item>
						<!-- 提交按钮 -->
						<el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
					</el-tab-pane>
					<el-tab-pane label="ThinkAPI短信模板" name="think_sms_config">
						<el-form-item label="绑定手机模板ID" prop="bind_id"><el-input placeholder="请输入绑定手机模板ID" v-model="smsForm.bind_id"></el-input></el-form-item>
						<el-form-item label="解除手机模板ID" prop="relieve_id"><el-input placeholder="请输入解除手机模板ID" v-model="smsForm.relieve_id"></el-input></el-form-item>
						<el-form-item label="提现审核通过模板ID" prop="withdraw_pass_id">
							<el-input placeholder="请输入提现审核通过模板ID" v-model="smsForm.withdraw_pass_id"></el-input>
						</el-form-item>
						<el-form-item label="提现审核驳回模板ID" prop="withdraw_reject_id">
							<el-input placeholder="请输入提现审核驳回模板ID" v-model="smsForm.withdraw_reject_id"></el-input>
						</el-form-item>
						<el-form-item label="车主审核通过模板ID" prop="owner_pass_id">
							<el-input placeholder="请输入车主审核通过模板ID" v-model="smsForm.owner_pass_id"></el-input>
						</el-form-item>
						<el-form-item label="车主审核驳回模板ID" prop="owner_reject_id">
							<el-input placeholder="请输入车主审核驳回模板ID" v-model="smsForm.owner_reject_id"></el-input>
						</el-form-item>
						<el-form-item label="用户注册模板ID" prop="register_id">
							<el-input placeholder="请输入用户注册模板ID" v-model="smsForm.register_id"></el-input>
						</el-form-item>
						<el-form-item label="找回密码模板ID" prop="password_id">
							<el-input placeholder="请输入找回密码模板ID" v-model="smsForm.password_id"></el-input>
						</el-form-item>
						<el-form-item label="短信登录模板ID" prop="sms_login_id"><el-input placeholder="短信登录模板ID" v-model="smsForm.sms_login_id"></el-input></el-form-item>
						<el-form-item label="提现验证码模板ID" prop="withdraw_code_id">
							<el-input placeholder="提现验证码模板ID" v-model="smsForm.withdraw_code_id"></el-input>
						</el-form-item>
						<!-- 提交按钮 -->
						<el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
					</el-tab-pane>
					<el-tab-pane label="短信宝" name="smsbao">
						<el-form-item label="短信宝账号" prop="smsbao_account"><el-input placeholder="请输入短信宝账号" v-model="smsForm.smsbao_account"></el-input></el-form-item>
						<el-form-item label="短信宝密码" prop="smsbao_pass"><el-input placeholder="请输入短信宝密码" v-model="smsForm.smsbao_pass"></el-input></el-form-item>
						<el-form-item label="发送测试短信" prop="phone">
							<div class="test-send">
								<el-input placeholder="请输入测试的手机号码" v-model="smsForm.phone"></el-input>
								<el-button size="small" @click="testSend('smsbao')">发送测试</el-button>
							</div>
						</el-form-item>
						<!-- 提交按钮 -->
						<el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
					</el-tab-pane>
					<el-tab-pane label="选择接口" name="select">
						<el-form-item label="接口类型" prop="sms_type">
							<el-radio-group v-model="smsForm.sms_type">
								<el-radio label="0">ThinkAPI</el-radio>
								<el-radio label="1">短信宝</el-radio>
							</el-radio-group>
						</el-form-item>
						<!-- 提交按钮 -->
						<el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 标签页默认选中
			activeName: 'think',
			// 表单绑定数据对象
			smsForm: {
				phone: ''
			},
			// 表单验证规则
			smsFormRules: {
				sms_type: [{ required: true, message: '请选择短信接口类型', trigger: 'change' }]
			}
		};
	},
	created() {
		this.sms();
	},
	methods: {
		/**
		 * 获取表单数据
		 */
		async sms() {
			const { data: res } = await this.$http.get('functional/sms');
			if (res.code !== 200) return this.$message.error(res.msg);
			this.smsForm = res.data;
		},

		/**
		 * 测试短信发送
		 * @param {Object} type 接口类型
		 */
		async testSend(type) {
			this.smsForm.type = type;
			const { data: res } = await this.$http.post('functional/sms', this.smsForm);
			if (res.code !== 200) return this.$message.error(res.msg);
			this.$message.success(res.msg);
		},

		/**
		 * 提交
		 */
		submit() {
			this.$refs.smsFormRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.put('functional/sms', this.smsForm);
				if (res.code !== 200) return this.$message.error(res.msg);
				this.$message.success(res.msg);
				this.sms();
			});
		}
	}
};
</script>

<style lang="less" scoped>
.test-send {
	display: flex;
	.el-input {
		width: 30%;
		margin-right: 10px;
	}
}
</style>
