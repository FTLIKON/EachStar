<template>
	<div id="login">
		<div class="login-wrap">
			<ul class="menu-tab">
				<li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">{{ item.txt }}</li>
			</ul>
			<!--表单 start -->
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
				<el-form-item prop="username" class="item-form">
					<label for="username">邮箱</label>
					<el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item prop="password" class="item-form">
					<label for="password">密码</label>
					<el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
				</el-form-item>
				
				<el-form-item prop="passwords" class="item-form" v-show="model === 'register'">
					<label for="passwords">密码</label>
					<el-input id="passwords" type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
				</el-form-item>
				
				<el-form-item prop="code" class="item-form">
					<label for="code">验证码</label>
					<el-row :gutter="10">
						<el-col :span="15">
							<el-input id="code" v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
						</el-col>
						<el-col :span="9">
							<el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				
				<el-form-item>
					<el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block" :disabled="loginButtonStatus">
						{{ model === 'login' ? '登录' : '注册'}}
					</el-button>
				</el-form-item>
				
			</el-form>
		</div>
	</div>
</template>

<script>
import { GetSms, Register, Login} from "../../api/login";
import { reactive, ref } from "vue";
import { stripscript, validatePass, validateEmail, validateVCode } from "@/utils/validate.js";
export default {
	name: "login",
	setup(props, { root, refs }) {
		// 验证用户名
		let validateUsername = (rule, value, callback) => {
			if(value === '') {
				callback(new Error('请输入用户名'));
			}else if(validateEmail(value)) {
				callback(new Error('用户名格式有误'));
			}else {
				callback();
			}
		};
		// 验证密码
		let validatePassword = (rule, value, callback) => {
			// 过滤后的数据
			ruleForm.password = stripscript(value);
			value = ruleForm.password;
			if(value === '') {
				callback(new Error('请输入密码'));
			}else if(validatePass(value)) {
				callback(new Error('密码为6至20数字+字母'));
			}else {
				callback();
			}
		};
		// 验证重复密码
		let validatePasswords = (rule, value, callback) => {
			// 如果模块值为login， 直接通过
			if(model.value === 'login') { callback(); }
			// 过滤后的数据
			ruleForm.passwords = stripscript(value);
			value = ruleForm.passwords;
			if(value === '') {
				callback(new Error('请再次输入密码'));
			}else if(value != ruleForm.password) {
				callback(new Error('重复密码不正确'));
			}else {
				callback();
			}
		};
		// 验证验证码
		let validateCode = (rule, value, callback) => {
			if(value === '') {
				callback(new Error('请输入验证码'));
			}else if(validateVCode(value)) {
				callback(new Error('验证码格式有误'));
			}else {
				callback();
			}
		};
		
		/**
		 * 声明数据
		 */
		// 这里面放置data数据、生命周期、自定义的函数
		const menuTab = reactive([
			{ txt: '登录', current: true, type: 'login'},
			{ txt: '注册', current: false, type: 'register'}
		]);
		// 模块值
		const model = ref('login');
		// 登录按钮状态禁用
		const loginButtonStatus = ref(true);
		// 验证码按钮状态
		const codeButtonStatus = reactive({
			status: false,
			text: '获取验证码'
		});
		// 倒计时
		const timer = ref(null);
		// 表单绑定数据
		const ruleForm = reactive({
			username: "",
			password: "",
			passwords: "",
			code: ""
		});
		// 表单的验证
		const rules = reactive({
			username: [{ validator: validateUsername, trigger: 'blur' }],
			password: [{ validator: validatePassword, trigger: 'blur' }],
			passwords: [{ validator: validatePasswords, trigger: 'blur' }],
			code: [{ validator: validateCode, trigger: 'blur' }]
		});
		
		/**
		 * 声明函数
		 */
		const toggleMenu = (data => {
			menuTab.forEach((elem) => {
				elem.current = false
			});
			// 高光
			data.current = true;
			// 修改模块值
			model.value = data.type;
			// 重置表单
			refs.ruleForm.resetFields();
		});
		/**
		 * 获取验证码
		 */
		const getSms = (() => {
			//进行提示
			if(ruleForm.username == ''){
				root.$message.error("邮箱不能为空");
				return false;
			}
			if(validateEmail(ruleForm.username)){
				root.$message.error("邮箱格式有误，请重新输入!");
				return false;
			}
			
			// 获取验证码
			let requestData = {
				username: ruleForm.username,
				module: model.value
			};
			// 修改获取验证按钮状态
			codeButtonStatus.status = true;
			codeButtonStatus.text = '发送中';
			
			// 延时多长时间
			// setTimeout(() => {
				GetSms(requestData).then(respone => {
					let data = respone.data;
					root.$message({
						message: data.message,
						type: 'success'
					});
					
					// 启用登录或注册按钮
					loginButtonStatus.value = false;
					// 调定时器，倒计时
					countDown(10);
				}).catch(error => {
					console.log(error);
				});
			// }, 3000);
		});
		/**
		 * 提交表单
		 */
		const submitForm = (formName => {
			refs[formName].validate((valid) => {
				// 表单验证通过
				if(valid) {
					let requestData = {
						username: ruleForm.username,
						password: ruleForm.password,
						code: ruleForm.code,
						module: model.value
					}
					
					if(model.value === 'login') {
						login(requestData);
					}else{
						register(requestData);
					}
					
				}else{
					console.log('error submit!');
					return false;
				}
			});
		});
		/**
		 * 登录
		 */
		const login = ((requestData) => {
			//登录接口
			Login(requestData).then(respone => {
				let data = respone.data;
				root.$message({
					message: data.message,
					type: 'success'
				});
				
				// 登录成功
				// toggleMenu(menuTab[0]);
				clearCountDown();
				
			}).catch(error => {
				console.log(error);
			});
		});
		/**
		 * 注册
		 */
		const register = ((requestData) => {
			//注册接口
			Register(requestData).then(respone => {
				let data = respone.data;
				root.$message({
					message: data.message,
					type: 'success'
				});
				
				// 注册成功
				toggleMenu(menuTab[0]);
				clearCountDown();
				
			}).catch(error => {
				console.log(error);
			});
		});
		/**
		 * 倒计时
		 */
		const countDown = ((number) => {
			// setTimeout 只执行一次
			// setInterval 不断的执行， 需要条件才会停止
			
			// 判断定时器是否存在，存在则清除
			if(timer.value) { clearInterval(timer.value); }
			
			let time = number;
			 
			timer.value = setInterval(() => {
				time--;
				if(time === 0){
					clearInterval(timer.value);
					codeButtonStatus.status = false;
					codeButtonStatus.text = "再次获取";
				}else{
					codeButtonStatus.text = `倒计时${time}秒`;
				}
			}, 1000);
		});
		/**
		 * 清除倒计时
		 */
		const clearCountDown = (() => {
			// 还原验证码按钮默认状态
			codeButtonStatus.status = false;
			codeButtonStatus.text = '获取验证码';
			// 清除倒计时
			clearInterval(timer.value);
		});
		
		return {
			menuTab, model, loginButtonStatus, codeButtonStatus, ruleForm, rules,
			
			toggleMenu, getSms, submitForm
		}
	}
}
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
	width: 330px;
	margin: auto;
}
.menu-tab {
	text-align: center;
	li {
		display: inline-block;
		width: 88px;
		line-height: 36px;
		font-size: 14px;
		color: #fff;
		border-radius: 2px;
		cursor: pointer;
	}
	.current {
		background-color: rgba(0,0,0,.1);
	}
}
.login-form {
	margin-top: 29px;
	label {
		display: block;
		margin-bottom: 3px;
		font-size: 14px;
		color: #fff;
	}
	.item-form { margin-bottom: 13px; }
	.block {
		width: 100%;
		display: block;
	}
	.login-btn { margin-top: 19px; }
}
</style>
