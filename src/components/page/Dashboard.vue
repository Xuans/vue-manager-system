<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <!--用户信息-->
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img v-bind:src="userInfo.avator" class="user-avator" @click="showModAvator">
            <div class="user-info-cont">
              <div class="user-info-name" @click="showModUserInfo">{{userInfo.nickName}}</div>
              <div>{{userInfo.roleRemark}}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{userInfo.lastLoginTime}}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{userInfo.lastLoginAddress}}</span>
          </div>
        </el-card>

        <!--熟练度-->
        <el-card shadow="hover" style="height:252px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px;font-weight:bold;font-family: 'Microsoft Himalaya'">技能熟练度</span>
            <span
              style="position:relative;left:180px;color: #20a0ff;font-size: small;"
              @click="showCard"
            >查看更多</span>
          </div>
          <div v-for="o in skills">
            {{o.name}}
            <el-progress :percentage="o.percent" :color="o.color"></el-progress>
          </div>
        </el-card>
      </el-col>

      <!--统计信息-->
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">666</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">888</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1024</div>
                  <div>数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="hover" style="height:403px;">
          <div slot="header" class="clearfix">
            <el-row :gutter="20">
              <el-col :span="8">
                <span
                  @click="move2Todo"
                  style="font-size: 18px;font-weight:bold;font-family: 'Microsoft Himalaya'"
                >待 办 事 项</span>
                <!--<el-button style="float: left; padding: 6px 0" type="text">待 办 事 项</el-button>-->
              </el-col>
              <el-col :span="10" :offset="6">
                <el-input
                  v-model="todoAdd"
                  placeholder="输入待办事项，回车添加"
                  maxlength="20"
                  minlength="1"
                  align="center"
                  clearable
                  size="small"
                  @keyup.enter.native="makesure"
                ></el-input>
              </el-col>
            </el-row>
          </div>
          <el-table
            :data="todoList"
            :show-header="false"
            height="304"
            style="width: 100%;font-size:14px;"
          >
            <!--<el-table-column width="40">-->
            <!--<template slot-scope="scope">-->
            <!--<el-checkbox v-model="scope.row.status"></el-checkbox>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column>
              <template slot-scope="list">
                <!--<div class="todo-item" :class="{'todo-item-del': scope.row.status}">-->
                <div
                  class="todo-item"
                  style="float:left;"
                  :class="{'todo-item-doing': list.row.status}"
                >{{list.row.Context}}</div>
                <div style="float:right;" width="60">
                  <!-- 阿西吧,参数搞错了,折腾好久 -->
                  <i class="el-icon-edit" @click="modTodo(list.row)"></i>
                  <i class="el-icon-delete" @click="delTodo(list.row.TodoID)"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!--底部统计信息-->
    <el-row :gutter="20">
      <!--最近七天用户访问趋势-->
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :data="logData"
            type="line"
            :options="loginOption"
          ></schart>
        </el-card>
      </el-col>

      <!--最近七天用户访问量-->
      <el-col :span="12">
        <el-card shadow="always" style="width: 100%;height: 100%;">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px;font-weight:bold;font-family: 'Microsoft Himalaya'">系统通知</span>
          </div>
          <el-table
            :data="sysMsgList"
            :show-header="false"
            stripe
            height="240"         
          >
            <el-table-column>
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="150"></el-table-column>
            <!-- <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- Dialog -->
    <!-- dialog 修改头像 -->
    <el-dialog id="dashboard" title="修 改 头 像" :visible.sync="dialogModAvator" width="30%" center>
      <el-upload
        class="avatar-uploader"
        :auto-upload="true"
        ref="upload"
        action="string"
        :http-request="uploadFile"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>

    <!-- dialog 修改资料 -->
    <el-dialog title="修 改 资 料" :visible.sync="dialogModUserInfo" width="40%" center>
      <el-form ref="modUserInfo" :model="modUserInfo" :rules="ModUserInfoRules" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="modUserInfo.nickname" clearable maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input type="age" v-model.number="modUserInfo.age" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="modUserInfo.sex" placeholder="请选择性别" prop="sex">
            <el-option label="未选择" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" maxlength="11">
          <el-input v-model="modUserInfo.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input v-model="modUserInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="id" maxlength="18">
          <el-input v-model="modUserInfo.id" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModUserInfoForm">立即创建</el-button>
          <el-button @click="commonCancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- dialog 修改Todo事项 -->
    <el-dialog title="修 改 待 办" :visible.sync="dialogModTodoInfo" width="40%" center>
      <el-form ref="move2Object" :model="move2Object" label-width="80px">
        <el-form-item
          label="状态"
          :rules="[
                    { required: true, message: '状态必选'},
                  ]"
        >
          <el-select v-model="move2Object.move2" placeholder="请选择目标状态" prop="move2">
            <el-option label="Todo" value="Todo"></el-option>
            <el-option label="Doing" value="Doing"></el-option>
            <el-option label="Done" value="Done"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModTodo">确认</el-button>
          <el-button @click="commonCancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- dialog 修改技能熟练度 -->
    <el-dialog title="练 功 房" :visible.sync="dialogModCard" width="40%" center>
      <el-tabs v-model="skillTabName" @tab-click="skillClick">
        <el-tab-pane name="打怪升级" label="打怪升级"></el-tab-pane>
        <el-tab-pane name="研究技能" label="研究技能"></el-tab-pane>
      </el-tabs>
      <el-card shadow="always">
        <div v-if="upLevel">
          <div v-for="o in skills">
            {{o.name}}
            <i class="el-icon-delete" @click="removeSkill(o.id)"></i>
            <el-slider
              v-model="o.percent"
              @change="modSkill(o.id,o.percent)"
              v-bind:color="o.color"
            ></el-slider>
          </div>
        </div>
        <div v-if="addSkill">
          <el-input v-model="addSkillRemark" clearable placeholder="自定义技能"></el-input>
          <el-slider v-model="addSkillPercent" show-input></el-slider>
          <el-button style="position: relative;left: 350px" @click="addNewSkill">修炼</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import Schart from "vue-schart";
import bus from "../common/bus";
import utils from "../../utils/index.js";
import lrz from "lrz";

export default {
  name: "dashboard",
  data() {
    return {
      sysMsgList: [    
        //     {
        //   date: "2018-04-19 20:00:00",
        //   title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护"
        // }
      ],
      // 用户信息
      dialogModUserInfo: false,
      modUserInfo: {
        nickname: "",
        age: 18,
        sex: "0",
        id: "",
        email: "",
        mobile: ""
      },
      ModUserInfoRules: {
        nickname: [
          { required: true, message: "请输入昵称" },
          { validator: utils.formRule.checkNickName }
        ],
        age: [{ validator: utils.formRule.isIntegerNotMust }],
        mobile: [{ validator: utils.formRule.validatePhone }],
        email: [{ validator: utils.formRule.validateEMail }],
        id: [{ validator: utils.formRule.validateIdNo }]
      },

      // 登录面板
      dialogModAvator: false,
      imageUrl: "",
      userInfo: {
        nickName: "我是你爸爸",
        avator: "../../../static/img/avator/noface.jpg",
        roleRemark: "系统管理员",
        lastLoginTime: "2008-11-11 11:11:11",
        lastLoginAddress: "日本东京"
      },
      name: localStorage.getItem("ms_username"),

      // todo相关
      dialogModTodoInfo: false,
      todoAdd: "",
      move2Object: {
        move2: "",
        id: 0
      },
      todoList: [],

      //技能熟练度
      dialogModCard: false,
      skillTabName: "打怪升级",
      upLevel: true,
      addSkill: false,
      addSkillRemark: "",
      addSkillPercent: 0,
      skills: [
        {
          id: 1,
          name: "Go",
          percent: 80,
          color: "#409EFF"
        },
        {
          id: 2,
          name: "Java",
          percent: 60,
          color: "#67C23A"
        }
      ],

      logData: [
        {
          name: "2018-12-01",
          value: 1083
        },
        {
          name: "2018-12-02",
          value: 941
        }
      ],
      loginOption: {
        title: "最近七天用户访问趋势",
        fillColor: "#FC6FA1",
        axisColor: "#008ACD",
        contentColor: "#EEEEEE",
        bgColor: "#F5F8FD",
        bottomPadding: 30,
        topPadding: 30
      }
    };
  },
  components: {
    Schart
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  created() {
    this.handleListener();
  },
  mounted() {
    this.getUserDashboard();
    this.initTodoList();
    this.getSkillList();
    this.getLoginHis();
    this.getSysMsg();
    this.userInfo.avator = sessionStorage.getItem("avator");
    this.userInfo.nickName = sessionStorage.getItem("nickname");
    this.userInfo.roleRemark = sessionStorage.getItem("ms_role");
  },
  activated() {
    this.handleListener();
  },
  deactivated() {
    window.removeEventListener("resize", this.renderChart);
    bus.$off("collapse", this.handleBus);
  },
  methods: {
    commonCancle() {
      this.dialogModTodoInfo = false;
      this.dialogModAvator = false;
      this.dialogModUserInfo = false;
    },
    showCard() {
      this.dialogModCard = true;
    },
    skillClick(tab, event) {
      if (this.skillTabName === "打怪升级") {
        this.upLevel = true;
        this.addSkill = false;
      } else if (this.skillTabName === "研究技能") {
        this.addSkillRemark = "";
        this.addSkillPercent = 0;
        this.upLevel = false;
        this.addSkill = true;
      }
    },
    async getSkillList() {
      let res = await utils.http.simpleMicroPost(
        "SkillSrv",
        "GetSkillList",
        {}
      );
      if (res.code === 0) {
        let len = res.data.length;
        if (res.data.length <= 0) {
          this.skills = new Array();
          let initSkill = {};
          initSkill.id = 0;
          initSkill.name = "虚位以待";
          initSkill.percent = 0;
          this.skills.push(initSkill);
        } else {
          this.skills = new Array();
          for (let i = 0; i < len; i++) {
            let tmp = {};
            tmp.id = res.data[i].SkillID;
            tmp.name = res.data[i].SkillName;
            tmp.percent = res.data[i].SkillPercent;
            if (tmp.percent < 60) {
              tmp.color = "#CC3333";
            } else if (tmp.percent < 75) {
              tmp.color = "#993399";
            } else if (tmp.percent < 90) {
              tmp.color = "#00CC00";
            } else {
              tmp.color = "#0099CC";
            }
            this.skills.push(tmp);
          }
        }
      } else if (res.code === 1) {
        this.$message({
          message: "登录状态过期，请重新登录",
          type: "warning"
        });
        sessionStorage.removeItem("ms_token");
        sessionStorage.removeItem("ms_userid");
        sessionStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else {
        this.$message({
          message: "练功信息读取失败！",
          type: "warning"
        });
      }
    },
    async removeSkill(id) {
      console.log(id);
      let obj = {};
      obj.SkillID = id;
      let res = await utils.http.simpleMicroPost("SkillSrv", "DelSkill", obj);
      if (res.code === 0) {
        this.skillTabName = "打怪升级";
        for (let i = 0; i < this.skills.length; i++) {
          if (this.skills[i].id == id) {
            console.log("remove", id);
            this.skills.splice(i, 1);
          }
        }
        this.upLevel = true;
        this.addSkill = false;
      } else if (res.code === 1) {
        this.$message({
          message: "登录状态过期，请重新登录",
          type: "warning"
        });
        sessionStorage.removeItem("ms_token");
        sessionStorage.removeItem("ms_userid");
        sessionStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else {
        this.$message({
          message: "删除秘籍失败！",
          type: "warning"
        });
      }
      await this.getSkillList();
    },
    async modSkill(id, percent) {
      console.log(id, percent);
      let obj = {};
      obj.SkillID = id;
      obj.Percent = percent;
      let res = await utils.http.simpleMicroPost("SkillSrv", "ModSkill", obj);
      if (res.code === 0) {
        this.skillTabName = "获得经验";
        this.upLevel = true;
        this.addSkill = false;
      } else if (res.code === 1) {
        this.$message({
          message: "登录状态过期，请重新登录",
          type: "warning"
        });
        sessionStorage.removeItem("ms_token");
        sessionStorage.removeItem("ms_userid");
        sessionStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else {
        this.$message({
          message: "经验增加失败！",
          type: "warning"
        });
      }
      await this.getSkillList();
    },
    async addNewSkill() {
      if (this.addSkillRemark === "") {
        this.$message({
          message: "英雄，留下神功名字啊！",
          type: "warning"
        });
        return;
      }
      let obj = {};
      obj.SkillName = this.addSkillRemark;
      obj.SkillPercent = this.addSkillPercent;
      let res = await utils.http.simpleMicroPost("SkillSrv", "AddSkill", obj);
      if (res.code === 0) {
        this.$message({
          message: "开始练功",
          type: "success"
        });
        this.skillTabName = "打怪升级";
        obj.name = obj.SkillName;
        obj.percent = obj.SkillPercent;
        this.skills.push(obj);
        this.upLevel = true;
        this.addSkill = false;
      } else if (res.code === 1) {
        this.$message({
          message: "登录状态过期，请重新登录",
          type: "warning"
        });
        sessionStorage.removeItem("ms_token");
        sessionStorage.removeItem("ms_userid");
        sessionStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else {
        this.$message({
          message: "武学秘籍录入失败！",
          type: "warning"
        });
      }
      await this.getSkillList();
    },
    //获取用户dashboard信息
    async getUserDashboard() {
      let res = await utils.http.simpleMicroPost(
        "UserInfoSrv",
        "GetDashboardForm",
        {}
      );
      if (res.code === 0) {
        this.userInfo.nickName = res.data.NickName;
        this.userInfo.avator = res.data.Avator;
        this.userInfo.roleRemark = res.data.Role;
        this.userInfo.lastLoginTime = res.data.LastTime;
        this.userInfo.lastLoginAddress = res.data.LastArea;
      } else if (res.code === 1) {
        this.$message({
          message: "登录状态过期，请重新登录",
          type: "warning"
        });
        sessionStorage.removeItem("ms_token");
        sessionStorage.removeItem("ms_userid");
        sessionStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else {
        console.log("dashbord加载失败");
      }
    },

    //提交修改资料
    showModUserInfo() {
      this.dialogModUserInfo = true;
    },
    async submitModUserInfoForm() {
      let dataObj = {};
      dataObj.NickName = this.modUserInfo.nickname;
      dataObj.Age = this.modUserInfo.age;
      dataObj.Sex = parseInt(this.modUserInfo.sex);
      dataObj.Mobile = this.modUserInfo.mobile;
      dataObj.Email = this.modUserInfo.email;
      dataObj.Identification = this.modUserInfo.id;
      let res = await utils.http.simpleMicroPost(
        "UserInfoSrv",
        "ModUserInfo",
        dataObj
      );
      if (res.code === 0) {
        this.userInfo.nickName = this.modUserInfo.nickname;
        this.$message({
          message: "资料修改成功",
          type: "success"
        });
      } else if (res.code === 1) {
        this.$message({
          message: "登录状态过期，请重新登录",
          type: "warning"
        });
        sessionStorage.removeItem("ms_token");
        sessionStorage.removeItem("ms_userid");
        sessionStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else {
        this.$message.error("资料修改失败");
      }
      this.dialogModUserInfo = false;
    },

    //提交修改头像
    showModAvator() {
      this.imageUrl = "";
      this.dialogModAvator = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async uploadFile(param) {
      try {
        // 获取文件
        let file = param.file;
        // 获取文件后 清除历史文件
        this.$refs.upload.clearFiles();

        /**
         * 压缩图片
         * Face++
         * 图片要求 ：
         * 图片格式：JPG(JPEG)，PNG
         * 图片像素尺寸：最小48*48像素，最大4096*4096像素
         * 图片文件大小：2MB === 2097152 byte
         */
        let result = await lrz(file);
        // console.log(result.base64);
        // this.$message.info(`正在上传中... ${(result.base64Len / 1024 / 1024).toFixed(2)} MB`);

        // let infoJson = await this.$axios({
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     url: 'http://www.micro.com/sync/',
        //     method: 'post',
        //     data: {
        //         image_base64: result.base64
        //     },
        //     // transformRequest: [(data) => {
        //     //   // 做任何你想改变的数据
        //     //   let ret = '';
        //     //   for (let it in data) {
        //     //     ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
        //     //   }
        //     //   return ret;
        //     // }]
        // });
        let data = {};
        data.AvatorUrl = result.base64;

        let res = await utils.http.simpleMicroPost(
          "UserInfoSrv",
          "ModUserAvator",
          data
        );
        if (res.code === 0) {
          this.$message.success("上传成功!");
          this.userInfo.avator = result.base64;
          this.dialogModAvator = false;
        } else if (res.code === 1) {
          this.$message({
            message: "登录状态过期，请重新登录",
            type: "warning"
          });
          sessionStorage.removeItem("ms_token");
          sessionStorage.removeItem("ms_userid");
          sessionStorage.removeItem("ms_username");
          this.$router.push("/login");
        } else {
          this.$message.error(`上传失败!`);
        }
        this.$message.success("上传成功!");
        this.userInfo.avator = result.base64;
        this.dialogModAvator = false;
      } catch (e) {
        console.log(e);
        this.$message.error(`上传失败!`);
      }
    },
    handleAvatarSuccess(res, file) {
      this.dialogModAvator = false;
      this.userInfo.avator = URL.createObjectURL(file.raw);
    },

    //待办列表
    move2Todo() {
      this.$router.push("/todo");
    },
    async makesure() {
      if (this.todoAdd === "") {
        this.$message({
          message: "写点内容再添加啊，老铁!",
          type: "warning",
          center: true
        });
        return;
      }
      let dataObj = {};
      dataObj.Context = this.todoAdd;
      let res = await utils.http.simpleMicroPost("TodoSrv", "AddTodo", dataObj);
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "添加成功!"
        });
      } else {
        this.$message.error(s.desc);
      }
      this.todoAdd = "";
      this.initTodoList();
    },
    async initTodoList() {
      let res = await utils.http.simpleMicroPost("TodoSrv", "QryUndo", {});
      if (res.code === 0) {
        this.todoList = res.data.UndoList;
        for (var i = 0; i < this.todoList.length; i++) {
          // console.log(this.todoList[i]);
          if (this.todoList[i].Type === 2) {
            this.todoList[i].status = true;
          } else {
            this.todoList[i].status = false;
          }
        }
      }
    },
    async delTodo(id) {
      let dataObj = {};
      dataObj.TodoID = id;
      let res = await utils.http.simpleMicroPost("TodoSrv", "DelTodo", dataObj);
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      } else {
        this.$message.error(s.desc);
      }
      this.initTodoList();
    },
    modTodo(row) {
      this.dialogModTodoInfo = true;
      // console.log(row);
      if (row.Type == 1) {
        this.move2Object.move2 = "Todo";
      } else if (row.Type == 2) {
        this.move2Object.move2 = "Doing";
      } else if (row.Type == 3) {
        this.move2Object.move2 = "Done";
      } else {
        this.move2Object.move2 = "请选择";
      }
      this.move2Object.id = row.TodoID;
    },
    async submitModTodo() {
      let dataObj = {};
      dataObj.TodoID = this.move2Object.id;
      if (this.move2Object.move2 == "Todo") {
        dataObj.Move2Type = 1;
      } else if (this.move2Object.move2 == "Doing") {
        dataObj.Move2Type = 2;
      } else if (this.move2Object.move2 == "Done") {
        dataObj.Move2Type = 3;
      }
      let res = await utils.http.simpleMicroPost(
        "TodoSrv",
        "MoveTodo",
        dataObj
      );
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "状态修改成功!"
        });
      } else {
        this.$message.error(s.desc);
      }
      this.dialogModTodoInfo = false;
      this.initTodoList();
    },

    //登录历史
    async getLoginHis() {
      let res = await utils.http.simpleMicroPost("LoginSrv", "LoginHis", {});
      if (res.code === 0) {
        this.logData = res.data;
      } else {
        console.log(res.desc);
      }
    },

    async getSysMsg() {
      let obj = {};
      obj.RecordIndex = 0;
      obj.RecordSize = 10;
      let res = await utils.http.simpleMicroPost(
        "MessageSrv",
        "GetSysMessage",
        obj
      );
      if (res.code === 0) {
        let lens = res.data.RecordList.length;
        for (var i = 0; i < lens; i++) {
          let o = {};
          o.title = res.data.RecordList[i].MsgContent;
          o.date = res.data.RecordList[i].Time;
          this.sysMsgList.push(o);
        }
      } else {
        console.log(res.desc);
      }
    },

    handleListener() {
      bus.$on("collapse", this.handleBus);
      // 调用renderChart方法对图表进行重新渲染
      window.addEventListener("resize", this.renderChart);
    },
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart();
      }, 300);
    },
    renderChart() {
      this.$refs.line.renderChart;
    },
    showChoise() {
      console.log(this.move2Object.move2);
    }
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
  color: #4eff4d;
}

.todo-item-doing {
  /*text-decoration: line-through;*/
  color: #ffaf31;
}

.schart {
  width: 100%;
  height: 300px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
