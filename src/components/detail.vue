<template>

    <div>
        <div class="input-div">
            <index></index>
        </div>

        <div class="table-div" >
            <div style="text-align: center">
                <el-link type="primary" style="font-size: large">文件</el-link>
            </div>

            <el-table
                      :data="article"
                      v-loading="loading"
            >
                <el-table-column
                    prop="id"
                    label="Id" fixed
                    width="100px"
                ></el-table-column>
                <el-table-column width="100px"
                                 label="文件名"
                >
                    <template slot-scope="scope">
                        <span v-html="scope.row.fileName"></span>
                    </template>
                </el-table-column>
                <el-table-column width="100px"
                                 prop="filePath"
                                 label="文件路径"
                ></el-table-column>
                <el-table-column
                    label="文件内容">
                    <template slot-scope="scope">
                        <span v-html="scope.row.fileContent"></span>
                    </template>
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
    </div>
</template>

<script>
import axios from 'axios'
import index from './index'

var store = {
    loading: true,

    article: [],
    keyword: '',
    isShow: false
}
export default {
    name: 'detail',
    components: {
        index
    },
    data () {
        return store
    },
    created: function () {
        this.loading = true;
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
                    vueThis.keyword = response.data.msg
                    vueThis.isShow = true
                    vueThis.loading = false
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
.input-div {
    position: fixed;
    left: 50%;
    top: 10% !important;
    transform: translate(-50%, -50%);
    z-index: 10000;
}

.table-div {
    margin-top: 150px;
}

em {
    color: orangered;
}
</style>
