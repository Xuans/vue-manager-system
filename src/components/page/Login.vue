<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label="top" label-width="30%" class="ms-content">
                <el-form-item label="账　号" prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入您的账号">
                    </el-input>
                </el-form-item>

                <el-form-item label="密　码" prop="passwd">
                    <el-input type="password" v-model="ruleForm.passwd" placeholder="请输入您的密码">
                    </el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="vcode">
                    <el-input  v-model="ruleForm.vcode"
                              placeholder="请输入验证码" @keyup.enter.native="submitLogin('ruleForm')">
                        <el-button slot="append" class="vcode-right" type="warning"
                                   @keyup.enter="submitLogin('ruleForm')"
                                   @click="generatedCode2()" plain>{{ruleForm.vcodeCheck}}
                        </el-button>
                    </el-input>
                </el-form-item>

                <div class="below-btn">
                    <el-button type="primary" @click="submitLogin('ruleForm')" round>登 录</el-button>
                    <span></span>
                    <el-button type="success" @click="submitRegister" round>注 册</el-button>
                </div>
                <div>
                    <p>
                        <span class="login-tips-left" @click="forgetPassword">忘记密码？</span>
                        <span class="login-tips-right" @click="clearForm('ruleForm')">重置</span>
                    </p>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import utils from '../../utils/index.js';
    import md5 from 'js-md5';

    export default {
        data: function () {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    if (value.toString().toLocaleUpperCase() !== this.ruleForm.vcodeCheck) {
                        callback(new Error('验证码错误'));
                    }
                    callback();
                }
            };
            return {
                ruleForm: {
                    username: '',
                    passwd: '',
                    vcode: '',
                    vcodeCheck: this.generatedCode(),
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {validator: utils.formRule.checkUserName, trigger: 'blur'}
                    ],
                    passwd: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator: utils.formRule.checkPassWord, trigger: 'blur'}
                    ],
                    vcode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            async submitLogin(formName) {
                let checkResult = false;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        checkResult = true;
                    } else {
                        checkResult = false;
                        this.$refs[formName].resetFields();
                        this.ruleForm.username = '';
                        this.ruleForm.passwd = '';
                        this.ruleForm.vcode = '';
                        this.ruleForm.vcodeCheck = this.generatedCode();
                        // alert("登录失败，用户名或密码错误");
                       // utils.dialog.showWaringDialog("登录失败，用户名或密码错误");
                        this.$message.error('登录失败，用户名或密码错误');
                    }
                });
                if (!checkResult) {
                    return
                }

                let dataObj = {};
                dataObj.username = this.ruleForm.username;
                dataObj.passwd = md5(this.ruleForm.passwd);
                dataObj.platform = "Web";
                let obj = JSON.stringify(dataObj);
                let res = await utils.http.simpleMicroPost("http://www.micro.com:10086/sync", "LoginSrv", "Login", obj);
                if (res.code == 0) {
                    sessionStorage.setItem("ms_username", this.ruleForm.username);
                    sessionStorage.setItem("ms_userid", res.data.userid);
                    sessionStorage.setItem("ms_token", res.data.token);
                    this.$router.push('/');
                } else if(res.code == 1) {
                    this.$message({
                        message: '登录状态过期，请重新登录',
                        type: 'warning'
                    });
                    this.$router.push('/');
                }else {
                    this.$refs[formName].resetFields();
                    this.ruleForm.username = '';
                    this.ruleForm.passwd = '';
                    this.ruleForm.vcode = '';
                    this.ruleForm.vcodeCheck = this.generatedCode();
                    this.$message.error('登录失败，用户名或密码错误');
                }
            },
            submitRegister() {
                this.$router.push('/register');
            },
            forgetPassword() {
                this.$message({
                    message: '忘记密码功能暂未实现，敬请期待',
                    type: 'success'
                });
            },
            generatedCode() {
                const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let code = '';
                for (let i = 0; i < 4; i++) {
                    let index = Math.floor(Math.random() * 36);
                    code += random[index]
                }
                return code
            },
            generatedCode2() {
                this.ruleForm.vcodeCheck = this.generatedCode();
            },
            clearForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>


<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/png-background/background.png);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #0099CC;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 40px;
    }

    .vcode-right {
        width: 72px;
    }

    .below-btn {
        text-align: center;
        width: 100%;
    }

    .below-btn button {
        width: 45%;
        height: 36px;
        margin-bottom: 10px;
    }

    .below-btn span {
        width: 10%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips-left {
        position: absolute;
        left: 50px;
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }

    .login-tips-right {
        position: absolute;
        right: 50px;
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
