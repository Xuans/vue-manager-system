<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="blue icon-blue-baocun"></i> 职位爬取</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_web" placeholder="获取爬虫列表" class="handle-select" clearable>
                    <el-option v-for="item in webs"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="select_job" placeholder="获取职位列表" class="handle-select" clearable>
                    <el-option v-for="item in jobs"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="select_city" placeholder="获取城市列表" class="handle-select" clearable>
                    <el-option v-for="item in citys"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker class="handle-date"
                                v-model="select_date"
                                type="daterange"
                                align="center"
                                unlink-panels
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                </el-date-picker>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input"></el-input>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </div>

            <el-table :data="tableData" border stripe class="table" ref="multipleTable" htight="250"
                      @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column prop="date" label="发布日期" sortable>
                </el-table-column>
                <el-table-column prop="job" label="职位">
                </el-table-column>
                <el-table-column prop="salary" label="薪水">
                </el-table-column>
                <el-table-column prop="company" label="公司">
                </el-table-column>
                <el-table-column prop="city" label="城市">
                </el-table-column>
                <el-table-column prop="area" label="区域">
                </el-table-column>
                <el-table-column prop="industry" label="行业">
                </el-table-column>
                <el-table-column prop="requirement" label="需求">
                </el-table-column>
                <el-table-column prop="welfare" label="福利">
                </el-table-column>
                <el-table-column prop="address" label="链接">
                    <template slot-scope="scope">
                        <a v-bind:href="scope.row.address">查看详情</a>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑-->
                        <!--</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                               :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'spidetable',
        data() {
            return {
                url: './static/vuetable.json',
                cur_page: 1,
                multipleSelection: [],
                select_web: '',
                select_job: '',
                select_city: '',
                select_word: '',
                select_date: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,


                webs: [{
                    value: '拉勾网',
                    label: '拉勾网'
                }, {
                    value: 'Boss直聘',
                    label: 'Boss直聘'
                }, {
                    value: '人才100',
                    label: '人才100'
                }, {
                    value: '智联招聘',
                    label: '智联招聘'
                }],

                jobs: [{
                    value: 'C++',
                    label: 'C++'
                }, {
                    value: 'Java',
                    label: 'Java'
                }, {
                    value: 'Golang',
                    label: 'Golang'
                }, {
                    value: 'Python',
                    label: 'Python'
                }, {
                    value: 'PHP',
                    label: 'PHP'
                }, {
                    value: 'JavaScript',
                    label: 'JavaScript'
                }],

                citys: [{
                    value: '北京',
                    label: '北京'
                },
                    {
                        value: '上海',
                        label: '上海'
                    },
                    {
                        value: '广州',
                        label: '广州'
                    },
                    {
                        value: '深圳',
                        label: '深圳'
                    },
                    {
                        value: '南京',
                        label: '南京'
                    },
                    {
                        value: '西安',
                        label: '西安'
                    },
                    {
                        value: '成都',
                        label: '成都'
                    }],

                tableData: [{
                    date: '2016-05-02',
                    job: 'Go',
                    salary: '30k-60k',
                    company: '华溯时代文化传媒深圳有限公司',
                    city: '深圳',
                    area: '火车站',
                    industry: '移动互联网,游戏/不需要融资/150-500人',
                    requirement: '社交',
                    welfare: '互联网金融 无天花板 六险一金 期权激励',
                    address: 'https://www.lagou.com/gongsi/179.html'
                }, {
                    date: '2016-05-02',
                    job: 'Go',
                    salary: '30k-60k',
                    company: '华溯时代文化传媒深圳有限公司',
                    city: '深圳',
                    area: '火车站',
                    industry: '移动互联网,游戏/不需要融资/150-500人',
                    requirement: '社交',
                    welfare: '互联网金融 无天花板 六险一金 期权激励',
                    address: 'https://www.lagou.com/gongsi/179.html'
                }, {
                    date: '2016-05-02',
                    job: 'Go',
                    salary: '30k-60k',
                    company: '华溯时代文化传媒深圳有限公司',
                    city: '深圳',
                    area: '火车站',
                    industry: '移动互联网,游戏/不需要融资/150-500人',
                    requirement: '社交',
                    welfare: '互联网金融 无天花板 六险一金 期权激励',
                    address: 'https://www.lagou.com/gongsi/179.html'
                }, {
                    date: '2016-05-02',
                    job: 'Go',
                    salary: '30k-60k',
                    company: '华溯时代文化传媒深圳有限公司',
                    city: '深圳',
                    area: '火车站',
                    industry: '移动互联网,游戏/不需要融资/150-500人',
                    requirement: '社交',
                    welfare: '互联网金融 无天花板 六险一金 期权激励',
                    address: 'https://www.lagou.com/gongsi/179.html'
                }],


                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_web) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list2';
                // };
                // this.$axios.post(this.url, {
                //     page: this.cur_page
                // }).then((res) => {
                //     this.tableData = res.data.list;
                // })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            },
            // 确定删除
            deleteRow() {
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 150px;
    }

    .handle-date {

    }

    .handle-input {
        width: 240px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }
</style>
