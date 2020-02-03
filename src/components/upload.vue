<template>
    <div>
上传文件
    </div>
</template>

<script>
import axios from 'axios'

var store = {
}
export default {
    name: 'upload',
    data () {
        return store
    },
    created: function () {
        this.init()
    },
    mounted: function () {
        this.btnquery()
    },
    methods: {
        init: function () {
            var vueThis = this
            axios.post('/api' + '/queryBrowser', {})
                .then(function (response) {
                    vueThis.browser = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post('/api' + '/querySystem', {})
                .then(function (response) {
                    vueThis.system = response.data
                })
                .catch(function (error) {
                    console.log(error)
                })
            axios.post('/api' + '/queryDevice', {})
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
                url: '/api' + '/queryList',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.items = response.data
                    console.log(JSON.stringify(vueThis.items) + '----------------')
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
            axios({
                url: '/api' + '/queryListCount',
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
                url: '/api' + '/queryList',
                method: 'post',
                data: vueThis.queryForm,
            })
                .then(function (response) {
                    vueThis.items = response.data
                    console.log(JSON.stringify(vueThis.items))
                })
                .catch(function (error) {
                    console.log(vueThis.items + '-=================')
                })
            axios({
                url: '/api' + '/queryListCount',
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
</style>
