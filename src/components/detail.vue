<template>

    <div class="detail">
        <div class="input-div">
            <index></index>
        </div>

        <div class="table-div">
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
                        <span v-html="scope.row.documentname"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="文件内容">
                    <template slot-scope="scope">
                        <span v-html="scope.row.documentcontent"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="文件位置">
                    <template slot-scope="scope">
                        <el-link @click="open1(scope.row.documentname)">I:\<span v-html="scope.row.documentname"></span>
                        </el-link>
                    </template>

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
        data() {
            return store
        },
        created: function () {
            this.loading = true;
            this.query()
        },
        methods: {
            open1: function (name) {
                var name1 = name.replace(/<em>/g, "");
                //需要转义
                var name2 = name1.replace(/<\/em>/g, "");
                window.open("http://localhost:8889/" + name2);
            },
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
                    url: process.env.HOST + '/queryDocument'
                    /*url: 'https://114.55.94.186/queryDocument'*/
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

<style lang="scss">
    .detail {
    /*输入框水平居中*/
    .input-div {
        position: fixed;
        left: 50%;
        top: 10% !important;
        transform: translate(-50%, -50%);
        z-index: 100;
    }

    .table-div {
        margin-top: 150px;
    }

    em {
        color: orangered;
    }
    }
</style>
