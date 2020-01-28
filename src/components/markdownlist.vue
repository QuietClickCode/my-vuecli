<template>
    <div>
        <div id="markdownlist">
            <div style="text-align: center">
                <el-link type="primary" style="font-size: large">markdown详情</el-link>
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
                <el-table-column fixed="right" width="200px"
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
        <div id="viewmarkdowndetail" style="display: none;">
            <div style="text-align: center"><span>标题</span></div>
            <div style="position: fixed;top:0px;left:0px;z-index:1000000">
                <el-button @click="enter">退出</el-button>
            </div>
            <el-row>
                <mavon-editor :editable="false" ref="myMarkdownviewtitle"  id="viewtitle" v-model="viewmarkdowndetailtitle" :toolbars="toolbars"/>
            </el-row>
            <div style="text-align: center;padding-top: 0px">正文</div>
            <el-row>
                <mavon-editor :editable="false" ref="myMarkdownviewtitle"  id="viewcontent" v-model="viewmarkdowndetailcontent" :toolbars="toolbars"/>
            </el-row>
            <div style="position:fixed;bottom: 10px;left:600px;z-index:1000000">
                <el-button @click="enter">确定</el-button>
            </div>
        </div>
        <div id="updatemarkdowndetail" style="display: none;">
            <div style="text-align: center"><span>标题</span></div>
            <div style="position: fixed;top:0px;left:0px;z-index:1000000">
                <el-button @click="enter">退出</el-button>
            </div>
            <el-row>
                <mavon-editor ref="myMarkdownupdatetitle"  id="updatetitle" v-model="updatemarkdowndetailtitle" :toolbars="toolbars"/>
            </el-row>
            <div style="text-align: center;padding-top: 0px">正文</div>
            <el-row>
                <mavon-editor ref="myMarkdownupdatetitle"  id="updatecontent" v-model="updatemarkdowndetailcontent" :toolbars="toolbars"/>
            </el-row>
            <div style="position:fixed;bottom: 10px;left:600px;z-index:1000000">
                <el-button @click="updatemarkdown">保存</el-button>
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
    updatemarkdowndetailtitle: '',
    updatemarkdowndetailcontent: '',
    viewmarkdowndetailtitle: '',
    viewmarkdowndetailcontent: '',
    currentId: '',
    dialogVisible: false,
    currentRow:"",
    toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true // 导航目录
    }
}
export default {
    name: 'markdownlist',
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
                url:'https://114.55.94.186'+ '/deletemarkdown',
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
        updatemarkdown: function () {
            var vueThis = this
            axios({
                url: 'https://114.55.94.186'+'/updatemarkdown',
                method: 'post',
                data: {
                    'title': vueThis.updatemarkdowndetailtitle,
                    'content': vueThis.updatemarkdowndetailcontent,
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
            $('#markdownlist').show()
            $('#viewmarkdowndetail').hide()
            $('#updatemarkdowndetail').hide()
        },
        viewdetail: function (row) {
            $('#markdownlist').hide()
            $('#viewmarkdowndetail').show()
            this.viewmarkdowndetailcontent = row.content
            this.viewmarkdowndetailtitle = row.title
        },
        adddetail: function (row) {
            this.$router.push({
                path: '/markdown'
            })
        },
        deletedetail: function (row) {
            var vueThis = this
            vueThis.dialogVisible = true;
            vueThis.currentRow = row;
        },
        updatedetail: function (row) {
            $('#markdownlist').hide()
            $('#updatemarkdowndetail').show()
            this.updatemarkdowndetailcontent = row.content
            this.updatemarkdowndetailtitle = row.title
            this.currentId = row.id
        },
        init: function () {
            var vueThis = this
            axios.post('https://114.55.94.186'+'/queryBrowser', {})
                .then(function (response) {
                    vueThis.browser = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post('https://114.55.94.186'+'/querySystem', {})
                .then(function (response) {
                    vueThis.system = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post('https://114.55.94.186'+'/queryDevice', {})
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
                url:'https://114.55.94.186'+'/queryMarkdownList',
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
                url: 'https://114.55.94.186'+'/queryMarkdownListCount',
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
                url: 'https://114.55.94.186'+'/queryMarkdownList',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.items = response.data
                })
                .catch(function (error) {
                    console.log(vueThis.items + '-=================')
                })
            axios({
                url: 'https://114.55.94.186'+'/queryMarkdownListCount',
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
#viewtitle {
    height: 50px; /*至少300px*/
}

#viewcontent {
    height: 500px;
}
#updatetitle {
    height: 50px; /*至少300px*/
}

#updatecontent {
    height: 500px;
}
</style>
