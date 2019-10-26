<template>
    <div>
        <div style="text-align: center">
            <el-link type="primary" style="font-size: large">搜索结果详情</el-link>
        </div>

        <el-table height="550"
                  :data="article"
                  style="width: 100%">
            <el-table-column
                prop="title"
                label="标题" min-width="100px"
            >
            </el-table-column>
            <el-table-column
                prop="sellPoint"
                label="卖点" min-width="100px">
            </el-table-column>
            <el-table-column
                prop="price" width="100px"
                label="价格">
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
                url: '/detaillist',
                data: JSON.stringify({
                    'content': vueThis.keyword.substring(1)
                }),
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
