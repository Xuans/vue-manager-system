<template>
    <div class="register-wrap">
        <div class="ms-register">
            <div class="ms-title">用 户 注 册</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <p class="top-attention">用户名：4~8个字符，可使用字母、数字、下划线，需以字母开头</p>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <p class="top-attention">密码：6~16个字符，区分大小写，至少包含一个大小写英文字符和一个数字字符</p>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <p class="top-attention">确认密码：请再次确认密码</p>
                <el-form-item prop="passwordCheck">
                    <el-input type="password" v-model="ruleForm.passwordCheck" @keyup.enter="submitRegister">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <div class="below-btn">
                    <el-button type="primary" @click="submitRegister('ruleForm')" round>注 册</el-button>
                    <span></span>
                    <el-button type="success" @click="returnLogin" round>返回登录</el-button>
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
                    callback(new Error('请输入确认密码'));
                } else {
                    if (value.toString() !== this.ruleForm.password) {
                        callback(new Error('两次密码不一致'));
                    }
                    callback();
                }
            };
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    passwordCheck: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {validator: utils.formRule.checkUserName, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator: utils.formRule.checkPassWord, trigger: 'blur'}
                    ],
                    passwordCheck: [
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator: utils.formRule.checkPassWord, trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            async submitRegister(formName) {
                let checkResult = false;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        checkResult = true;
                    } else {
                        checkResult = false;
                        this.$refs[formName].resetFields();
                        this.ruleForm.username = '';
                        this.ruleForm.passwd = '';
                        this.ruleForm.passwdck = '';
                        this.$message({
                            message: '请确认注册信息是否正确',
                            type: 'warning'
                        });
                    }
                });
                if (!checkResult) {
                    return
                }

                let dataObj = {};
                dataObj.username = this.ruleForm.username;
                dataObj.passwd = md5(this.ruleForm.password);
                dataObj.passwdck = md5(this.ruleForm.passwordCheck);
                let res = await utils.http.simpleMicroPost( "LoginSrv", "Register", dataObj);
                if (res.code === 0) {
                    //utils.dialog.showOKDialog("注册成功");
                    this.$message({
                        message: '注册成功',
                        type: 'success'
                    });
                } else {
                    this.$refs[formName].resetFields();
                    //utils.dialog.showWaringDialog("注册失败，请重试");
                    this.$message.error('注册失败，请重试');
                }
            },
            returnLogin() {
                this.$router.push('/login');
            }
        }
    }
</script>


<style scoped>
    .register-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../../static/img/background/login-1.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 2px solid #ddd;
    }

    .ms-register {
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
        padding: 30px 30px;
    }

    .top-attention {
        position: relative;
        left: auto;
        color: #999;
        font-size: 6px;
        line-height: 12px;
        padding: 6px;
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

</style>
