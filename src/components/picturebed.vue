<template>
    <div>
        <div style="text-align: center">
            <el-link type="primary" style="font-size: large">图床</el-link>
        </div>

        <input type="file" name="file" id="file" @change="uploadImage">
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'

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
        uploadImage: function (file) {
            var vueThis = this
            var formData = new FormData()
            // debugger
            formData.append('file', $('#file')[0].files[0])
            axios({
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: 'post',
                url: '/api' + '/uploadImg',
                data: formData
            })
                .then(function (response) {
                    vueThis.$message(response.data.msg)
                })
                .catch(function (error) {
                    console.log(error)
                })
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
                url: '/api' + '/detaillist',
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
