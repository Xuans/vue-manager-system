<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="service icon-service-rds_mysqlyunshujukuRDSMy"></i> 监控
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="form-tab">
                <el-tabs v-model="activeName" @tab-click="handleClick" type="card" style="height: 60px;">
                    <el-tab-pane name="StatusWatcher">
                        <span slot="label"><i class="service icon-service-icon-test"></i> 状态监控</span>
                    </el-tab-pane>
                    <el-tab-pane name="DateBaseWatcher">
                        <span slot="label"><i class="service icon-service-database"></i> 数据库查询</span>
                    </el-tab-pane>
                    <el-tab-pane name="MysqlWatcher">
                        <span slot="label"><i class="service icon-service-window"></i> 数据库终端窗口</span>
                    </el-tab-pane>
                    <el-tab-pane name="RedisWatcher">
                        <span slot="label"><i class="service icon-service-table"></i> Redis终端窗口</span>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="form-bottom">
                <!-- 数据监控 -->
                <div v-if="StatusWatcher">
                    <el-collapse accordion>
                        <el-collapse-item title=" SHOW STATUS">
                            <!--<el-input-->
                            <!--placeholder="请输入关键字"-->
                            <!--v-model="search_1"-->
                            <!--prefix-icon="el-icon-search"-->
                            <!--clearable>-->
                            <!--</el-input>-->
                            <el-table
                                height="250"
                                stripe
                                border
                                :data="StatusWatcherTableData_1"
                                style="width: 100%">
                                <el-table-column
                                    prop="VariableName"
                                    label="VariableName">
                                </el-table-column>
                                <el-table-column
                                    prop="Value"
                                    label="Value">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>

                        <el-collapse-item title=" SHOW FULL PROCESSLIST">
                            <el-table
                                height="250"
                                stripe
                                border
                                :data="StatusWatcherTableData_2"
                                style="width: 100%"
                                :default-sort="{prop: 'Id', order: 'ascending'}">
                                <el-table-column
                                    fixed="left"
                                    prop="Id"
                                    label="Id"
                                    width="60"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="User"
                                    label="User"
                                    width="80"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="Host"
                                    label="Host"
                                    width="150"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="DB"
                                    label="DB"
                                    width="80"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="Command"
                                    label="Command"
                                    width="80"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="Time"
                                    label="Time"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="State"
                                    label="State">
                                </el-table-column>
                                <el-table-column
                                    prop="Info"
                                    label="Info"
                                    width="400">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </div>

                <!-- 表获取 -->
                <div v-if="DateBaseWatcher">
                    <tr>
                        <td style="width:210px;float:left;">
                            <el-select v-model="database" clearable placeholder="请选择数据库实例">
                                <el-option
                                    v-for="item in database_select"
                                    :key="item.Alias"
                                    :label="item.Alias"
                                    :value="item.Alias">
                                </el-option>
                            </el-select>
                        </td>
                        <td style="width:100px;float:left;">
                            <el-button type="primary" icon="el-icon-search" @click="QryTables(database)">搜 索</el-button>
                        </td>
                        <!--<td style="width:200px;float:left;">-->
                        <!--<el-input-->
                        <!--placeholder="请输入表名"-->
                        <!--v-model="search_2"-->
                        <!--prefix-icon="el-icon-search"-->
                        <!--clearable>-->
                        <!--</el-input>-->
                        <!--</td>-->
                    </tr>
                    <el-table
                        height="250"
                        stripe
                        border
                        :data="DateBaseWatcherTableData"
                        style="width: 100%">
                        <el-table-column
                            prop="Alias"
                            label="Alias"
                            sortable
                            fixed="left">
                        </el-table-column>
                        <el-table-column
                            prop="TableName"
                            label="TableName"
                            sortable
                            fixed="left">
                        </el-table-column>
                        <el-table-column
                            prop="TableComment"
                            label="TableComment">
                        </el-table-column>
                        <el-table-column
                            prop="TableType"
                            label="TableType">
                        </el-table-column>
                        <el-table-column
                            prop="Engine"
                            label="Engine">
                        </el-table-column>
                        <el-table-column
                            prop="TableRows"
                            label="TableRows">
                        </el-table-column>
                        <el-table-column
                            prop="AvgRowLength"
                            label="AvgRowLength">
                        </el-table-column>
                        <el-table-column
                            prop="TableCollation"
                            label="TableCollation">
                        </el-table-column>
                        <el-table-column
                            label="查看表详情"
                            fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" @click="QryTableColumns(scope.row)">查 看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div v-if="MysqlWatcher">
                    <iframe src="http://118.25.187.175:9090" scrolling="auto" frameborder="1"
                            height="400" width="1000"
                            style="position:relative;"></iframe>
                </div>

                <div v-if="RedisWatcher">
                    <iframe src="http://118.25.187.175:9091" scrolling="auto" frameborder="1"
                            height="400" width="1000"
                            style="position:relative;"></iframe>
                </div>
            </div>
        </div>

        <!-- dialog -->
        <el-dialog title="表字段信息" :visible.sync="dialogTableVisible">
            <el-table :data="tableColumns">
                <el-table-column property="ColumnName" label="ColumnName"></el-table-column>
                <el-table-column property="ColumnDefault" label="ColumnDefault"></el-table-column>
                <el-table-column property="IsNullAble" label="IsNullAble"></el-table-column>
                <el-table-column property="ColumnType" label="ColumnType"></el-table-column>
                <el-table-column property="ColumnKey" label="ColumnKey"></el-table-column>
                <el-table-column property="Extra" label="Extra"></el-table-column>
                <el-table-column property="ColumnComment" label="ColumnComment"></el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import utils from '../../utils/index.js';

    export default {
        name: 'database',
        data() {
            return {
                //tabs切换
                StatusWatcher: true,
                DateBaseWatcher: false,
                MysqlWatcher: false,
                RedisWatcher: false,
                activeName: "StatusWatcher",

                //tab-1
                search_1: '',
                StatusWatcherTableData_1: [],
                StatusWatcherTableData_2: [],

                //tab-2
                search_2: '',
                DateBaseWatcherTableData: [],
                database: '',
                database_select: [],
                tableColumns: [],
                dialogTableVisible: false,
            }
        },
        methods: {
            handleClick(tab, event) {
                if (this.activeName === "StatusWatcher") {
                    this.ShowProcess();
                    this.StatusWatcher = true;
                    this.DateBaseWatcher = false;
                    this.MysqlWatcher = false;
                    this.RedisWatcher = false;
                } else if (this.activeName === "DateBaseWatcher") {
                    this.QryDataBase();
                    this.StatusWatcher = false;
                    this.DateBaseWatcher = true;
                    this.MysqlWatcher = false;
                    this.RedisWatcher = false;
                } else if (this.activeName === "MysqlWatcher") {
                    this.StatusWatcher = false;
                    this.DateBaseWatcher = false;
                    this.MysqlWatcher = true;
                    this.RedisWatcher = false;
                } else if (this.activeName === "RedisWatcher") {
                    this.StatusWatcher = false;
                    this.DateBaseWatcher = false;
                    this.MysqlWatcher = false;
                    this.RedisWatcher = true;
                }
            },
            async ShowProcess() {
                let res = await utils.http.simpleMicroPost( "DataBaseSrv", "ShowProcess", {});
                if (res.code === 0) {
                    this.StatusWatcherTableData_1 = res.data.Status;
                    this.StatusWatcherTableData_2 = res.data.ProcessList;
                } else if (res.code === 1) {
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
            async QryDataBase() {
                let res = await utils.http.simpleMicroPost( "DataBaseSrv", "QryDataBase", {});
                if (res.code === 0) {
                    this.database_select = res.data;
                } else if (res.code === 1) {
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
            async QryTables(database) {
                let dataObj = {};
                dataObj.Alias = database;

                let res = await utils.http.simpleMicroPost( "DataBaseSrv", "QryTables", dataObj);
                if (res.code === 0) {
                    this.DateBaseWatcherTableData = res.data.Tables;
                } else if (res.code === 1) {
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
            async QryTableColumns(row) {
                let dataObj = {};
                dataObj.Alias = row.Alias;
                dataObj.TableName = row.TableName;

                let res = await utils.http.simpleMicroPost( "DataBaseSrv", "QryTableColumns", dataObj);
                if (res.code === 0) {
                    this.tableColumns = res.data;
                    this.dialogTableVisible = true;
                } else if (res.code === 1) {
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

            }
        }
    }
</script>

<style scoped>
</style>
