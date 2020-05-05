<template>
    <div id="articleresult">
        <div class="input-div">
            <index></index>
        </div>
        <div class="table-div" v-loading="loading">
            <div style="text-align: center">
                   <el-link type="primary" style="font-size: large">豆瓣电影</el-link>
            </div>
            <div id="result">
                <section class="centertest">
                    <p style="margin-left: 50px;"> 共找到相关结果{{result.total}}个,耗时{{result.took}}ms</p>
                    <ol>
                        <li v-for="(item,i) in data">
                            <el-card class="box-card">
                                <div style="display: inline-block;">
                                        <img
                                            class="img-thumbnail lazy"
                                            :src="item.cover_url"
                                        />
                                </div>
                                <div style="display: inline-block;width: 800px;">
                                    <p v-html="item.title">
                                        {{item.title}}
                                    </p>

                                    <p>豆瓣评分:{{item.score}}</p>
                                    <p>主演:{{item.actor_count}} <span v-for="item_,i_ in item.actors"
                                                                     v-html="item_+'/'">{{item_}}"</span>
                                    </p>
                                    <p>类型:<span v-for="item_1,i_1 in item.types" v-html="item_1">{{item_1}}</span></p>
                                    <p>制片国家/地区:<span v-for="item_2,i_2 in item.regions"
                                                     v-html="item_2">{{item_2}}</span>
                                    </p>
                                    <p>上映日期:{{item.release_date}}</p>
                                    <p>{{item.vote_count}}人评价</p>
                                    <p>下载地址:<a :href="item.url">{{item.url}}</a></p>
                                    <p>暂无简介</p>
                                </div>

                            </el-card>
                        </li>
                    </ol>
                </section>
                <!-- <div style="display: inline-block;position: fixed;bottom: 10px;left: 600px;">
                     <el-button id="prev" :disabled="isPrev" @click="prev(searchkeyword,result.pageNo-1)">上一页</el-button>
                     <el-button id="next" :disabled="isNext" @click="next(searchkeyword,result.pageNo+1)">下一页</el-button>
                 </div>-->
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import index from './index'

    var store = {
        data: [],
        result: {},
        articleresult: {},
        loading: true,
        keyword: '',
        // 结果列表
        articleresult: {},
        articledata: [],
        queryForm: {keyword: '', startpage: 0, location: '', system: '', createtime: [], browser: '', device: ''},
        system: [],
        browser: [],
        device: [],
        items: [],
        length: 0,
        currentpage: 1
    }
    export default {
        name: 'CSDNList',
        data () {
            return store
        },
        components: {
            index
        },
        created: function () {
            this.loading = true
            this.query()
        },
        methods: {
            query: function () {
                var vueThis = this
                axios({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    url: process.env.HOST + '/getKeyword'
                }).then(function (response) {
                    vueThis.keyword = response.data.msg
                    vueThis.searchBKYButton()
                }).catch(function (error) {
                    console.log(vueThis.items + '-=================')
                })
            },
            searchBKYButton: function () {
                var vueThis = this
                var searchkeyword = this.keyword
                axios({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'get',
                    url: process.env.HOST + '/s?wd=' + searchkeyword
                }).then(function (response) {
                    vueThis.data = response.data.data.list
                    vueThis.result = response.data.data
                    vueThis.loading = false
                    vueThis.searchkeyword = response.data.msg
                    $('#result').show()
                    vueThis.isNextDisabled(vueThis.result.pageNo)
                    vueThis.isPrevDisabled(vueThis.result.pageNo)
                }).catch(function (error) {
                })
            }
        }
    }
</script>

<style lang="scss">
    /*输入框水平居中*/
    .input-div {
        position: fixed;
        left: 50%;
        top: 10% !important;
        transform: translate(-50%, -50%);
        z-index: 100;
        background-color: white;
    }

    .centertest {
        transform: translate(10%, 0%);
        z-index: 100;
        width: 1200px;
        background-color: white;
    }

    .table-div {
        margin-top: 150px;
    }

    em {
        color: orangered;
    }

    .box-card {
        margin-top: 20px;
        width: 1200px;
    }

    ol {
        list-style: none;
    }

    .section {

    }
</style>
