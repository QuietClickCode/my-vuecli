<template>
    <div id="app" style="display: block">
        <div style="text-align: center">
            <el-link type="primary" style="font-size: large">系统操作日志详情</el-link>
        </div>
        <!--搜索条件-->
        <div>
            <div style="display:inline">
                <span style="margin-left: 50px;">关键字</span>
                <el-input style="margin-bottom:5px;width: 300px" v-model="data.queryForm.keyword"></el-input>
                <span style="margin-left: 50px;">位置</span>
                <el-input style="margin-bottom:5px;width: 300px" v-model="data.queryForm.location"></el-input>
                <span style="margin-left: 50px;">搜索时间</span>
                <el-date-picker style="margin-bottom:5px;width: 300px"
                                v-model="data.queryForm.createtime"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>

        <div>
            <div style="display:inline">
                <span style="margin-left: 33px;">操作系统</span>
                <el-select style="margin-bottom:5px;width: 300px" v-model="data.queryForm.system" placeholder="请选择">
                    <el-option
                        label="请选择"
                        value="">
                    </el-option>
                    <el-option
                        v-for="item in data.system"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span style="margin-left: 37px;">浏览器</span>
                <el-select style="margin-bottom:5px;width: 300px" v-model="data.queryForm.browser" placeholder="请选择">
                    <el-option
                        label="请选择"
                        value="">
                    </el-option>
                    <el-option
                        v-for="item in data.browser"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span style="margin-left: 80px;">设备</span>
                <el-select style="margin-bottom:5px;width: 300px" v-model="data.queryForm.device" placeholder="请选择">
                    <el-option
                        label="请选择"
                        value="">
                    </el-option>
                    <el-option
                        v-for="item in data.device"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>


        <el-table height="430"
                  :data="data.items"
        >
            <el-table-column
                prop="id"
                label="Id" fixed
            ></el-table-column>
            <el-table-column
                prop="operation"
                label="操作" fixed
            ></el-table-column>
            <el-table-column width="100px"
                             prop="user.id"
                             label="用户编号"
            ></el-table-column>
            <el-table-column width="100px"
                             prop="user.username"
                             label="用户名"
            ></el-table-column>
            <el-table-column width="100px"
                             prop="user.password"
                             label="密码"
            ></el-table-column>
            <el-table-column width="120px"
                             prop="location.ip"
                             label="外网IP">
            </el-table-column>
            <el-table-column width="120px"
                             prop="location.localIp"
                             label="局域网IP">
            </el-table-column>
            <el-table-column width="150px"
                             prop="location.location"
                             label="位置">
            </el-table-column>
            <el-table-column width="100px"
                             prop="location.x"
                             label="经度">
            </el-table-column>
            <el-table-column width="100px"
                             prop="location.y"
                             label="纬度">
            </el-table-column>

            <el-table-column width="100px"
                             prop="browserInfo.system"
                             label="操作系统">
            </el-table-column>
            <el-table-column width="100px"
                             prop="browserInfo.browserType"
                             label="浏览器类型">
            </el-table-column>
            <el-table-column width="120px"
                             prop="browserInfo.browserVersion"
                             label="浏览器版本">
            </el-table-column>
            <el-table-column width="100px"
                             prop="location.keyword"
                             label="设备">
            </el-table-column>
            <el-table-column fixed="right" width="200px"
                             prop="createtime"
                             label="创建时间">
            </el-table-column>
        </el-table>
        <div class="block" style="text-align: center">
            <el-pagination
                layout="prev, pager, next"
                :total="data.length"
                @current-change="handleCurrentChange"
                :current-page="data.currentpage"

            >
            </el-pagination>
        </div>
        <div style="text-align: center">
            <el-button @click="btnquery">查询</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            data: {
                queryForm: {
                    keyword: '',
                    startpage: 0,
                    location: '',
                    system: '',
                    createtime: [],
                    browser: '',
                    device: ''
                },
                system: [],
                browser: [],
                device: [],
                items: [],
                length: 0,
                currentpage: 1
            }
        }
    },
    created: function () {
        this.init()
    },
    mounted: function () {
        this.btnquery()

    },
    methods: {
        handleCurrentChange (val) {
            this.data.queryForm.startpage = 0 + (val - 1) * 10
            this.query()
            this.data.currentpage = val
        },
        init: function () {
            var vueThis = this
            axios.post('https://114.55.94.186' + '/queryBrowser', {})
                .then(function (response) {
                    vueThis.data.browser = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post('https://114.55.94.186' + '/querySystem', {})
                .then(function (response) {
                    vueThis.data.system = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post('https://114.55.94.186' + '/queryDevice', {})
                .then(function (response) {
                    vueThis.data.device = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        query: function () {
            var vueThis = this
            alert("dd")
            axios({
                url: 'https://114.55.94.186' + '/querySystemLog',
                method: 'post',
                data: vueThis.data.queryForm,
            })
                .then(function (response) {
                    console.log(response)
                    vueThis.data.items = response.data
                    console.log(JSON.stringify(vueThis.items) + '----------------')
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
            axios({
                url: 'https://114.55.94.186' + '/queryCount',
                method: 'post',
                data: vueThis.data.queryForm,
            })
                .then(function (response) {
                    vueThis.length = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        btnquery: function () {
            alert("dddd")
            var vueThis = this
            /*条件查询就要清空起始页这个查询条件,不然会出问题*/
            vueThis.data.queryForm.startpage = 0
            vueThis.data.currentpage = 1
            axios({
                url: 'https://114.55.94.186' + '/querySystemLog',
                method: 'post',
                data: vueThis.data.queryForm,
            })
                .then(function (response) {
                    vueThis.data.items = response.data
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error)
                    console.log(vueThis.items + '-=================')
                })
            axios({
                url: 'https://114.55.94.186' + '/queryCount',
                method: 'post',
                data: vueThis.data.queryForm,
            })
                .then(function (response) {
                    vueThis.data.length = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }
}
</script>

<style>


/*输入框水平居中*/
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
