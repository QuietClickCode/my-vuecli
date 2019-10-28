<template>

    <div>
        <!--便签内容框放在最顶部,可清空,可无限扩展-->
        <el-input type="textarea" autosize :placeholder="notePlaceholder" class="textarea" v-model="note"
                  :style="{display:isSee}"
        ></el-input>
        <div class="center" @keyup.enter="enter(keyword)">
            <el-input autofocus id="el-input" style="width: 500px;"
                      @input="input(keyword)"
                      v-model="keyword">
            </el-input>
        </div>
        <div id="result" style="display: none">
            <section>
                <p>共找到相关结果{{result.total}}个,耗时{{result.took}}ms</p>
            </section>
            <section>
                <div v-for="(item,i) in data">
                    <p v-html="item.title">
                        {{item.title}}
                    </p>
                    <p>
                        <img
                            class="img-thumbnail lazy"
                            :src="item.cover_url"
                        />
                    </p>
                    <p>豆瓣评分:{{item.score}}</p>
                    <p>主演:{{item.actor_count}} <span v-for="item_,i_ in item.actors">{{item_.actors}}</span></p>
                    <p>类型:<span v-for="item_1,i_1 in item.types" v-html="item_1">{{item_1}}</span></p>
                    <p>制片国家/地区:<span v-for="item_2,i_2 in item.regions">{{item_2}}</span></p>
                    <p>上映日期:{{item.release_date}}</p>
                    <p>{{item.vote_count}}人评价</p>
                    <p>下载地址:<a :href="item.url">{{item.url}}</a></p>
                    <p>暂无简介</p>
                </div>
            </section>
            <div style="display: inline-block;position: fixed;bottom: 10px;left: 10px;">
                <el-button id="prev" :disabled="isPrev" @click="prev(searchkeyword,result.pageNo-1)">上一页</el-button>
                <el-button id="next" :disabled="isNext" @click="next(searchkeyword,result.pageNo+1)">下一页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'

var store = {
    //是否禁用
    isPrev: false,
    isNext: false,
    /*模式*/
    pattern: '',
    /*便签的默认提示*/
    notePlaceholder: '写点什么吧～～',
    /*便签内容*/
    note: '',
    /*便签是否可见*/
    isSee: 'none',
    /*输入框内容*/
    keyword: '',
    data: [],
    result: {},
    searchkeyword: ''
}
export default {
    name: 'index',
    data () {
        return store
    },
    methods: {
        isNextDisabled: function (page) {
            if (page * this.result.size >= this.result.total) {
                this.isNext = true
            } else {
                this.isNext = false
            }
        },
        isPrevDisabled: function (page) {
            if (page <= 1) {
                this.isPrev = true
            } else {
                this.isPrev = false

            }
        },
        next: function (keyword, page) {
            var vueThis = this
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: '/s?wd=' + keyword + '&pn=' + page
            })
                .then(function (response) {
                    vueThis.data = response.data.data.list
                    vueThis.result = response.data.data
                    vueThis.searchkeyword = response.data.msg
                    $('#result').show()
                    vueThis.isNextDisabled(vueThis.result.pageNo)
                    vueThis.isPrevDisabled(vueThis.result.pageNo)
                })
                .catch(function (error) {
                    console.log(vueThis.items + '-=================')
                })
        },
        prev: function (keyword, page) {
            var vueThis = this
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: '/s?wd=' + keyword + '&pn=' + page
            })
                .then(function (response) {
                    vueThis.data = response.data.data.list
                    vueThis.result = response.data.data
                    vueThis.searchkeyword = response.data.msg
                    $('#result').show()
                    vueThis.isNextDisabled(vueThis.result.pageNo)
                    vueThis.isPrevDisabled(vueThis.result.pageNo)
                })
                .catch(function (error) {
                    console.log(vueThis.items + '-=================')
                })
        },
        //enter激发
        enter: function (keyword) {
            if (keyword != '') {
                var isForward = keyword.startsWith('/')
                /*1.转发模式*/
                if (isForward) {
                    window.location.href = keyword.substring(1)
                } else {
                    this.other(keyword)
                }
            }
        },

        /*由enter()调用,非转发模式*/
        other: function (keyword) {
            var isNote = keyword.startsWith('\'')
            var isCommand = keyword.startsWith(':')
            /*2.便签模式*/
            if (isNote) {
                if (keyword.substring(1) == 'clear ') {
                    store.note = ''
                    store.keyword = '\''
                } else {
                    axios({
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'post',
                        url: '/note',
                        data: JSON.stringify({
                            'content': keyword.substring(1)
                        }),
                    })
                        .then(function (response) {
                            if (response.data.status == 0) {
                                if (store.note == '') {
                                    store.note = response.data.data.concat('---').concat(new Date().toLocaleString())
                                } else {
                                    store.note += '\n'.concat(response.data.data).concat('---').concat(new Date().toLocaleString())
                                }
                                store.keyword = '\''
                            }
                        })
                        .catch(function (error) {
                            console.log(vueThis.items + '-=================')
                        })
                }
                /*3.命令模式*/
            } else if (isCommand) {
                var vueThis = this
                var index = keyword.indexOf(' ')
                if (index != -1) {
                    /*命令关键字后面必须有空格哦*/
                    var command = keyword.substring(1, index + 1)
                    var isEnd = keyword.lastIndexOf(' ')
                    if (command == 'movie ') {
                        var searchkeyword = keyword.substring(7)
                        axios({
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'get',
                            url: '/s?wd=' + searchkeyword
                        })
                            .then(function (response) {
                                vueThis.data = response.data.data.list
                                vueThis.result = response.data.data
                                vueThis.searchkeyword = response.data.msg
                                $('#result').show()
                                vueThis.isNextDisabled(vueThis.result.pageNo)
                                vueThis.isPrevDisabled(vueThis.result.pageNo)
                            })
                            .catch(function (error) {
                                console.log(vueThis.items + '-=================')
                            })
                    }
                    if (isEnd + 1 == keyword.length) {
                        store.pattern = ':' + command
                        /*退出功能*/
                        if (store.pattern == ':logout ') {
                            axios({
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                method: 'get',
                                url: '/logout'
                            })
                                .then(function (response) {
                                    vueThis.$message(response.data.msg)
                                    setTimeout(function () {
                                            window.location.href = response.data.url
                                        }, 1000
                                    )
                                })
                                .catch(function (error) {
                                    console.log(vueThis.items + '-=================')
                                })
                        } else if ((store.pattern == ':clear ')) {
                            store.note = ''
                            $('#result').hide()
                        }
                    }
                }
                /*正常搜索*/
            } else {
                axios({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    url: '/todetail',
                    data: JSON.stringify({
                        'keyword': keyword
                    }),
                })
                    .then(function (response) {
                        window.location.href = 'detail'
                    })
                    .catch(function (error) {
                        console.log(vueThis.items + '-=================')
                    })
            }
        },

        /*输入触发*/
        input: function (keyword) {
            /*是否"开头*/
            var isNote = keyword.startsWith('\'')
            /*是否/开头*/
            var isForward = keyword.startsWith('/')
            /*是否:开头*/
            var isCommand = keyword.startsWith(':')
            /*开启转发模式,什么都不做,不向后台提交数据*/
            if (isForward) {
                /*开启命令模式*/
            } else if (isCommand) {

                /*开启便签模式*/
            } else if (isNote) {
                this.isSee = 'block'
                /*关闭便签模式*/
            } else if (keyword == '') {
                this.isSee = 'none'
                this.article = []
                /*正常模式,提交关键字到后台查询*/
            } else {

            }
        }
    }
}
</script>

<style>
em {
    color: orangered;
}

/*输入框水平居中*/
.center {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
