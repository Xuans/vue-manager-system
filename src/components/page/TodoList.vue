<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-rank"></i> Todo列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                Vue.Draggable：基于 Sortable.js 的 Vue 拖拽组件。 访问地址：<a href="https://github.com/SortableJS/Vue.Draggable"
                                                                 target="_blank">Vue.Draggable</a>
            </div>
            <div class="search-label">
                <el-form :inline="true">
                    <el-row type="flex">
                        <el-col :span="8">
                            <el-form-item>
                                <el-date-picker class="date-picker"
                                                v-model="date"
                                                align="left"
                                                type="date"
                                                clearable
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择日期"
                                                :picker-options="pickerDate">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchList(date)">搜 索</el-button>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item>
                                <el-input
                                    placeholder="添加TODO内容"
                                    v-model="addTODO"
                                    maxlength="20"
                                    minlength="1"
                                    align="center"
                                    clearable
                                    @keyup.enter.native="makesure">
                                </el-input>
                            </el-form-item>
                        </el-col>


                        <el-col :span="8">
                            <el-badge :value="this.todoNum" class="item" :max="99" type="primary">
                                <el-button size="small">TODO</el-button>
                            </el-badge>
                            <el-badge :value="this.doingNum" class="item" :max="99" type="primary">
                                <el-button size="small">DOING</el-button>
                            </el-badge>
                            <el-badge :value="this.doneNum" class="item" :max="99" type="primary">
                                <el-button size="small">DONE</el-button>
                            </el-badge>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div class="drag-box">
                <div class="drag-box-item">
                    <div class="item-title-todo">TODO</div>
                    <draggable v-model="TODO" @remove="moveHandle" :options="dragOptions">
                        <transition-group tag="div" id="TODO" class="item-ul">
                            <div v-for="(item,index) in TODO" class="drag-list" :key="index">
                                {{item.Context}}
                                <a class="item-date">{{item.Date}}</a>
                                <i class="el-icon-delete" @click="removeItem(TODO,index)"></i>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-item" background-color="#99CCFF">
                    <div class="item-title-doing">DOING</div>
                    <draggable v-model="DOING" @remove="moveHandle" :options="dragOptions">
                        <transition-group tag="div" id="DOING" class="item-ul">
                            <div v-for="(item,index) in DOING" class="drag-list" id="doinglist" :key="index">
                                {{item.Context}}
                                <a class="item-date">{{item.Date}}</a>
                                <i class="el-icon-delete" @click="removeItem(DOING,index)"></i>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-item" background-color="#0099CC">
                    <div class="item-title-done">DONE</div>
                    <draggable v-model="DONE" @remove="moveHandle" :options="dragOptions">
                        <transition-group tag="div" id="DONE" class="item-ul">
                            <div v-for="(item,index) in DONE" class="drag-list" :key="index">
                                {{item.Context}}
                                <a class="item-date">{{item.Date}}</a>
                                <i class="el-icon-delete" @click="removeItem(DONE,index)"></i>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import draggable from 'vuedraggable'
    import utils from '../../utils/index.js';
    // import moment from 'moment'

    export default {
        name: 'todolist',
        data() {
            return {
                date: '',//moment().format("YYYY-MM-DD"),
                addTODO: '',
                pickerDate: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                dragOptions: {
                    //属性参考  https://github.com/RubaXa/Sortable#event-object-demo
                    animation: 120,
                    scroll: true,
                    sort: true,//sorting inside list
                    group: 'sortlist',
                    ghostClass: 'ghost-style',
                    disabled: false,// Disables the sortable if set to true.
                },
                todoNum: 0,
                doingNum: 0,
                doneNum: 0,
                TODO: [],
                DOING: [],
                DONE: []
            }
        },
        components: {
            draggable
        },
        mounted() {
            this.initTodoList();
        },
        methods: {
            async initTodoList() {
                let dataObj = {};
                dataObj.Date = this.date;
                let res = await utils.http.simpleMicroPost( "TodoSrv", "QryTodo", dataObj);
                if (res.code == 0) {
                    this.TODO = res.data.TodoList;
                    this.DOING = res.data.DoingList;
                    this.DONE = res.data.DoneList;
                    this.doneNum = this.DONE.length;
                    this.doingNum = this.DOING.length;
                    this.todoNum = this.TODO.length;
                } else if (res.code == 1) {
                    this.$message({
                        message: '登录状态过期，请重新登录',
                        type: 'warning'
                    });
                    sessionStorage.removeItem("ms_token");
                    sessionStorage.removeItem("ms_userid");
                    sessionStorage.removeItem("ms_username");
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙，请稍后重试');
                }
            },
            async addTodoFunc() {
                let dataObj = {};
                dataObj.Context = this.addTODO;

                let res = await utils.http.simpleMicroPost( "TodoSrv", "AddTodo", dataObj);
                if (res.code == 0) {
                    await this.initTodoList();
                    this.addTODO = "";
                } else {
                    this.$message.error('添加TODO事项失败，请稍后重试');
                }
            },
            async removeItem(array, index) {
                let dataObj = {};
                dataObj.TodoID = array[index].TodoID;

                let res = await utils.http.simpleMicroPost( "TodoSrv", "DelTodo", dataObj);
                if (res.code == 0) {
                    await this.initTodoList();
                } else {
                    this.$message.error('删除TODO事项失败，请稍后重试');
                }
            },
            async moveHandle(event) {
                let index = event.newIndex;
                let dataObj = {};
                let res = {};
                if (event.from.id == "TODO" && event.to.id == "DOING") {
                    dataObj.TodoID = this.DOING[index].TodoID;
                    dataObj.Move2Type = 2;
                    res = await utils.http.simpleMicroPost( "TodoSrv", "MoveTodo", dataObj);
                } else if (event.from.id == "TODO" && event.to.id == "DONE") {
                    dataObj.TodoID = this.DONE[index].TodoID;
                    dataObj.Move2Type = 3;
                    res = await utils.http.simpleMicroPost( "TodoSrv", "MoveTodo", dataObj);
                } else if (event.from.id == "DOING" && event.to.id == "DONE") {
                    dataObj.TodoID = this.DONE[index].TodoID;
                    dataObj.Move2Type = 3;
                    res = await utils.http.simpleMicroPost( "TodoSrv", "MoveTodo", dataObj);
                } else if (event.from.id == "DOING" && event.to.id == "TODO") {
                    dataObj.TodoID = this.TODO[index].TodoID;
                    dataObj.Move2Type = 1;
                    res = await utils.http.simpleMicroPost( "TodoSrv", "MoveTodo", dataObj);
                } else if (event.from.id == "DONE" && event.to.id == "DOING") {
                    dataObj.TodoID = this.DOING[index].TodoID;
                    dataObj.Move2Type = 2;
                    res = await utils.http.simpleMicroPost( "TodoSrv", "MoveTodo", dataObj);
                } else if (event.from.id == "DONE" && event.to.id == "TODO") {
                    dataObj.TodoID = this.TODO[index].TodoID;
                    dataObj.Move2Type = 1;
                    res = await utils.http.simpleMicroPost( "TodoSrv", "MoveTodo", dataObj);
                }
                if (res.code === 0) {
                    this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
                    await this.initTodoList();
                } else {
                    this.$message.error('转移TODO事项失败，请稍后重试');
                }
            },
            async searchList(date) {
                await this.initTodoList();
            },
            async makesure() {
                if (this.addTODO === "") {
                    this.$message({
                        message: '写点内容再添加啊，老铁!',
                        type: 'warning',
                        center: true
                    });
                    return
                }

                let s = await this.addTodoFunc();
                if (s.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.addTODO = "";
                    this.initTodoList();
                } else {
                    this.$message.error(s.desc);
                }


                // this.$confirm('是否添加入TODO列表?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                // }).catch(() => {
                // });

            },

        }
    }
</script>

<style scoped>
    .drag-box {
        display: flex;
        user-select: none;
    }

    .drag-box-item {
        flex: 1;
        max-width: 450px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item {
        margin-top: 10px;
        margin-right: 40px;
    }

    .item-date {
        position: absolute;
        right: 35px;
        color: #a71d5d;
    }

    .el-icon-delete {
        position: absolute;
        right: 10px;
    }

    .item-title {
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

    .item-ul {
        padding: 0 8px 8px;
        height: 400px;
        overflow-y: scroll;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list {
        font-family: Consolas;
        position: relative;
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }

    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .ghost-style {
        display: block;
        color: transparent;
        border-style: dashed
    }

    .search-label {
        margin-left: auto;
        margin-bottom: 10px;
    }

    .item-title-todo {
        background-color: #99CCCC;
        text-align: center;
        font-style: oblique;
        font-size: 20px;
        color: #FFFFFF;
    }

    .item-title-doing {
        background-color: #0099CC;
        text-align: center;
        font-style: oblique;
        font-size: 20px;
        color: #FFFFFF;
    }

    .item-title-done {
        background-color: #003399;
        text-align: center;
        font-style: oblique;
        font-size: 20px;
        color: #FFFFFF;
    }

</style>
