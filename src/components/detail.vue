<template>
    <div>
        <div style="text-align: center">
            <el-link type="primary" style="font-size: large">搜索结果详情</el-link>
        </div>

        <el-table height="430"
                  :data="article"
        >
            <el-table-column
                prop="id"
                label="Id" fixed
                width="100px"
            ></el-table-column>
            <el-table-column width="100px"
                             prop="fileName"
                             label="文件名"
            ></el-table-column>
            <el-table-column width="100px"
                             prop="filePath"
                             label="文件路径"
            ></el-table-column>
            <el-table-column
                prop="fileContent"
                label="文件内容">
            </el-table-column>
            <el-table-column width="120px"
                             prop="fileType"
                             label="文件类型">
            </el-table-column>
            <el-table-column width="150px"
                             prop="createtime"
                             label="创建时间">
            </el-table-column>
            <el-table-column width="100px"
                             prop="createuser"
                             label="创建人">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios'

var store = {
    article: [],
    keyword: ''

}
export default {
    name: 'index',
    data () {
        return store
    },
    created: function () {
        this.query()
    },
    methods: {
        /*highlight: function () {
            var oBox = document.getElementsByTagName('table')[1]
            var oContent = oBox.innerHTML
            var val = this.keyword
            var findText = oContent.split(val)
            oBox.innerHTML = findText.join('<span style="color:red;">' + val + '</span> ')
        },*/
        query: function () {
            var vueThis = this
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                url: '/api' + '/queryDocument'
            })
                .then(function (response) {
                    vueThis.article = response.data.data
                    console.log(response.data.data)
                    vueThis.keyword = response.data.msg
                    //这儿必须延迟1秒执行,不然空白
                    /*setTimeout(function () {
                        vueThis.highlight()
                    }, 100)*/
                })
                .catch(function (error) {
                    console.log(vueThis.items + '-=================')
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
