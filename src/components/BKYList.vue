<template>
    <div id="articleresult">
        <div class="input-div">
            <index></index>
        </div>

        <div class="table-div" v-loading="loading">
            <div style="text-align: center">
                <el-link type="primary" style="font-size: large">博客园</el-link>
            </div>
            <section>
                <p>共找到相关结果{{articleresult.total}}个,耗时{{articleresult.took}}ms</p>
            </section>
            <section>
                <ol>
                    <li v-for="(item,i) in articledata" style="background-color: #DCDFE6">
                        <p v-html="item.title" @click="toArticleDetail(item.id)" class="articlecontent">
                            {{item.title}}</p>
                        <p v-html="item.content">
                            {{item.content}}</p>
                        <span>id:{{item.id}}</span>|
                        <span>创建时间:{{item.createtime}}</span>
                    </li>
                </ol>
            </section>
            <!-- <div style="display: inline-block;position: fixed;bottom: 10px;left: 600px;">
                 <el-button id="prevArticle" :disabled="isPrevArticle"
                            @click="prevarticle(articlesearchkeyword,articleresult.pageNo-1)">上一页
                 </el-button>
                 <el-button id="nextArticle" :disabled="isNextArticle"
                            @click="nextarticle(articlesearchkeyword,articleresult.pageNo+1)">下一页
                 </el-button>

             </div>-->
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import index from './index'

var store = {
    loading:true,
    keyword: '',
    //结果列表
    articleresult: {},
    articledata: [],
    queryForm: { keyword: '', startpage: 0, location: '', system: '', createtime: [], browser: '', device: '' },
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
        this.loading = true;
        this.query()
    },
    methods: {
        toArticleDetail: function (id) {
            var vueThis = this
            this.$router.push({
                path: '/article',
                query: {
                    platform: vueThis.platform,
                    id: id
                }
            })
        },
        query:function() {
            var vueThis = this;
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                url: '/api' + '/getKeyword'
            }).then(function (response) {
                vueThis.keyword = response.data.msg
                vueThis.searchBKYButton()
            }).catch(function (error) {
                console.log(vueThis.items + '-=================')
            })
        },
        searchBKYButton: function () {
            var vueThis = this
            vueThis.searchurl = 'searchbky'
            var articlesearchkeyword = vueThis.keyword
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: '/api' + '/searchbky?wd=' + articlesearchkeyword
            }).then(function (response) {
                vueThis.articledata = response.data.data.list
                vueThis.articleresult = response.data.data
                vueThis.loading = false;
                vueThis.articlesearchkeyword = response.data.msg
                vueThis.platform = 'bky_article'
                $('#articleresult').show()
                vueThis.isNextDisabledArticle(vueThis.articleresult.pageNo)
                vueThis.isPrevDisabledArticle(vueThis.articleresult.pageNo)
            }).catch(function (error) {
                console.log(vueThis.items + '-=================')
            })
        },
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
    z-index:10000;
}

.table-div {
    margin-top: 150px;
    height:450px;
    overflow: scroll;
}

em {
    color: orangered;
}
</style>
