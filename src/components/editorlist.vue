<template>
    <div>
        <div id="editorlist">
            <div style="text-align: center">
                <el-link type="primary" style="font-size: large">editor详情</el-link>
            </div>

            <!--搜索条件-->
            <div>
                <div style="display:inline">
                    <span style="margin-left: 50px;">关键字</span>
                    <el-input style="margin-bottom:5px;width: 300px" v-model="queryForm.keyword"></el-input>
                    <span style="margin-left: 50px;">位置</span>
                    <el-input style="margin-bottom:5px;width: 300px" v-model="queryForm.location"></el-input>
                    <span style="margin-left: 50px;">搜索时间</span>
                    <el-date-picker style="margin-bottom:5px;width: 300px"
                                    v-model="queryForm.createtime"
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
                    <el-select style="margin-bottom:5px;width: 300px" v-model="queryForm.system" placeholder="请选择">
                        <el-option
                            label="请选择"
                            value="">
                        </el-option>
                        <el-option
                            v-for="item in system"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <span style="margin-left: 37px;">浏览器</span>
                    <el-select style="margin-bottom:5px;width: 300px" v-model="queryForm.browser" placeholder="请选择">
                        <el-option
                            label="请选择"
                            value="">
                        </el-option>
                        <el-option
                            v-for="item in browser"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <span style="margin-left: 80px;">设备</span>
                    <el-select style="margin-bottom:5px;width: 300px" v-model="queryForm.device" placeholder="请选择">
                        <el-option
                            label="请选择"
                            value="">
                        </el-option>
                        <el-option
                            v-for="item in device"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>


            <el-table height="430"
                      :data="items"
            >
                <el-table-column
                    prop="id"
                    label="Id" fixed
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
                <el-table-column width="400px"
                                 prop="title"
                                 label="标题"
                ></el-table-column>
                <el-table-column width="400px"
                                 label="内容"
                >
                    <template slot-scope="scope">
                        {{scope.row.content.length>30?scope.row.content.substring(0,30)+"...":scope.row.content}}
                    </template>
                </el-table-column>
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
                <el-table-column width="200px"
                                 prop="createtime"
                                 label="创建时间">
                </el-table-column>
                <el-table-column fixed="right" width="200px"
                                 label="操作">
                    <template slot-scope="scope">
                        <el-button @click="adddetail(scope.row)" type="text" size="small">新增</el-button>
                        <el-button @click="viewdetail(scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="updatedetail(scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="deletedetail(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="text-align: center">
                <el-pagination
                    layout="prev, pager, next"
                    :total="length"
                    @current-change="handleCurrentChange"
                    :current-page="currentpage"
                >
                </el-pagination>
            </div>
            <div style="text-align: center">
                <el-button @click="btnquery">查询</el-button>
            </div>
        </div>
        <div id="vieweditordetail" style="display: none;">
            <div style="text-align: center"><span>标题</span></div>
            <div style="position: fixed;top:0px;left:0px;">
                <el-button @click="enter">退出</el-button>
            </div>
            <el-row>
                <quill-editor ref="myQuillEditorviewtitle" id="title" v-model="vieweditordetailtitle"
                              :options="editorOption">
                </quill-editor>
            </el-row>
            <div style="text-align: center;padding-top: 50px">正文</div>
            <el-row>
                <quill-editor ref="myQuillEditorviewcontent" id="content" v-model="vieweditordetailcontent"
                              :options="editorOption">
                </quill-editor>
            </el-row>
            <div style="position:fixed;bottom: 10px;left:600px;">
                <el-button @click="enter">确定</el-button>
            </div>
        </div>
        <div id="updateeditordetail" style="display: none;">
            <div style="text-align: center"><span>标题</span></div>
            <div style="position: fixed;top:0px;left:0px;">
                <el-button @click="enter">退出</el-button>
            </div>
            <el-row>
                <quill-editor ref="myQuillEditortitleupdatetitle" id="title" v-model="updateeditordetailtitle"
                              :options="editorOption">
                </quill-editor>
            </el-row>
            <div style="text-align: center;padding-top: 50px"><span>正文</span></div>
            <el-row>
                <quill-editor ref="myQuillEditortitleupdatecontent" id="content" v-model="updateeditordetailcontent"
                              :options="editorOption">
                </quill-editor>
            </el-row>
            <div style="position:fixed;bottom: 10px;left:600px;">
                <el-button @click="updateeditor">保存</el-button>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>删除后不可恢复,确认删除?</span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleClose">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'

var store = {
    queryForm: { keyword: '', startpage: 0, location: '', system: '', createtime: [], browser: '', device: '' },
    system: [],
    browser: [],
    device: [],
    items: [],
    length: 0,
    currentpage: 1,
    updateeditordetailtitle: '',
    updateeditordetailcontent: '',
    vieweditordetailtitle: '',
    vieweditordetailcontent: '',
    editorOption: {},
    currentId: '',
    dialogVisible: false,
    currentRow: ''
}
export default {
    name: 'editorlist',
    data () {
        return store
    },
    created: function () {
        this.init()
    },
    mounted: function () {
        this.query()
    },
    methods: {
        handleClose: function () {
            var vueThis = this
            vueThis.dialogVisible = false
            axios({
                url:process.env.HOST+ '/deleteeditor',
                method: 'post',
                data: {
                    'id': vueThis.currentRow.id
                },
            })
                .then(function (response) {
                    if (response.data == 1) {
                        vueThis.$message('删除成功')
                        vueThis.$router.go(0)
                    }
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
        },
        updateeditor: function () {
            var vueThis = this
            axios({
                url: process.env.HOST+'/updateeditor',
                method: 'post',
                data: {
                    'title': vueThis.updateeditordetailtitle,
                    'content': vueThis.updateeditordetailcontent,
                    'id': vueThis.currentId
                },
            })
                .then(function (response) {
                    if (response.data == 1) {
                        vueThis.$message('保存成功')
                        vueThis.$router.go(0)
                    }
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })

        },
        enter: function () {
            $('#editorlist').show()
            $('#vieweditordetail').hide()
            $('#updateeditordetail').hide()
        },
        viewdetail: function (row) {
            $('#editorlist').hide()
            $('#vieweditordetail').show()
            this.$refs.myQuillEditorviewtitle.quill.enable(false)
            this.$refs.myQuillEditorviewcontent.quill.enable(false)
            this.vieweditordetailcontent = row.content
            this.vieweditordetailtitle = row.title
        },
        adddetail: function (row) {
            this.$router.push({
                path: '/editor'
            })
        },
        deletedetail: function (row) {
            var vueThis = this
            vueThis.dialogVisible = true
            vueThis.currentRow = row
        },
        updatedetail: function (row) {
            $('#editorlist').hide()
            $('#updateeditordetail').show()
            this.updateeditordetailcontent = row.content
            this.updateeditordetailtitle = row.title
            this.currentId = row.id
        },
        init: function () {
            var vueThis = this
            axios.post(process.env.HOST+'/queryBrowser', {})
                .then(function (response) {
                    vueThis.browser = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post(process.env.HOST+'/querySystem', {})
                .then(function (response) {
                    vueThis.system = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post(process.env.HOST+'/queryDevice', {})
                .then(function (response) {
                    vueThis.device = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        handleCurrentChange (val) {
            this.queryForm.startpage = 0 + (val - 1) * 10
            this.query()
            this.currentpage = val
        },
        query: function () {
            var vueThis = this
            axios({
                url: process.env.HOST+'/queryEditor',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.items = response.data
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
            axios({
                url: process.env.HOST+'/queryEditorCount',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.length = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        btnquery: function () {
            var vueThis = this
            /*条件查询就要清空起始页这个查询条件,不然会出问题*/
            vueThis.queryForm.startpage = 0
            vueThis.currentpage = 1
            axios({
                url:process.env.HOST+ '/queryEditor',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.items = response.data
                })
                .catch(function (error) {
                })
            axios({
                url: process.env.HOST+'/queryEditorCount',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.length = response.data
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

#title {
    height: 50px;
    width: 1300px;
}

#content {
    height: 500px;
    width: 1300px;
}
</style>
