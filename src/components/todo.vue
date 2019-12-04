<template>
    <div class="container">
        <div class="header">待办事项</div>
        <div class="body">
            <ul>
                <li v-for="item in todoList">{{item}}</li>
                <!--<li>弹吉他</li>
                <li>写文章</li>
                <li>画画</li>
                <li>写歌</li>-->
            </ul>
        </div>
    </div>

</template>
<script>
import axios from 'axios'
import $ from 'jquery'

var store = {
    todoList: ['打篮球', '养花', '种草', '养殖', '弹吉他'],
    articledetail: '',
    article: [],
    IsShow: false,
    platform: 'article',
    id: '',
    title: '',
    rowstyle: {
        height: 50
    },
    date: ''
}
export default {
    name: 'ainotelist',
    data () {
        return store
    },
    created: function () {
        $('body').css('background-color', '#C7EDCC')
        if (this.$route.query.id != null && this.$route.query.platform != null) {
            this.id = this.$route.query.id
            this.platform = this.$route.query.platform
            this.queryArticleById(this.id, this.platform)
        } else {
            /*不加动画或者,时间太少,都回补了顶部,这个速度可以滑到顶部,并且不影响后面的手动下滑*/
            $('html,body').animate({ scrollTop: 0 }, 500)
            /*this.toggleFullScreen();*/

            this.queryArticle()

        }
    },
    mounted () {
        $('#table').hide()
        $('.el-textarea__inner').css('background', '#C7EDCC')
        $('.el-input__inner').css('background', '#C7EDCC')
        let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
        this.timer = setInterval(() => {
            _this.date = new Date() // 修改数据date
        }, 1000)
    },
    beforeDestroy () {
        //清楚样式
        $('body').css('background-color', 'white')
        $('.el-textarea__inner').css('background', 'white')
        $('.el-input__inner').css('background', 'white')
        if (this.timer) {
            clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
        }
    },
    methods: {
        closetable: function () {
            if ($('#table').css('display') == 'none') {
                $('#table').show()
            } else {
                $('#table').hide()
            }
        },
        view: function (id) {
            var result = store.article.filter(item => item.id == id)
            store.articledetail = result[0]
            $('#table').hide()
            this.id = id

        },
        next: function () {
            store.id++
            this.queryArticle()
        },
        back: function () {
            store.id--
            if (store.id <= 1) {
                store.id = 1
            }
            this.queryArticle()
        },
        queryArticle: function () {
            var vueThis = this
            axios({
                url: '/queryarticle',
                method: 'post',
                data: {
                    'id': store.id,
                    'keyword': store.keyword,
                    'title': store.title,
                    'content': store.content,
                    'platform': store.platform
                },
            })
                .then(function (response) {
                    store.article = response.data
                    if (store.article.length == 1) {
                        store.articledetail = store.article[0]
                        $('#table').hide()
                    } else {
                        $('#table').show()
                    }
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
        },
        queryArticleById: function (id, platform) {
            var vueThis = this
            axios({
                url: '/queryarticle',
                method: 'post',
                data: {
                    'id': id,
                    'keyword': store.keyword,
                    'title': store.title,
                    'content': store.content,
                    'platform': platform
                },
            })
                .then(function (response) {
                    store.article = response.data
                    if (store.article.length == 1) {
                        store.articledetail = store.article[0]
                        $('#table').hide()
                    } else {
                        $('#table').show()
                    }
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
        },
        music: function () {
            /*window.location = "http://music.nbclass.com/"*/
            this.IsShow = !this.IsShow
            if (this.IsShow) {
                $('#402192905').show()
            } else {
                $('#402192905').hide()
            }
        },
        toggleFullScreen: function () {
            if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement) {// current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen()
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen()
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                }
            }
        }

    }
}
</script>

<style scoped lang="less">
@import "../assets/css/font-awesome-4.7.0/css/font-awesome.min.css";
@import "../assets/css/APlayer.min.css";


/*中间内容设置上下间距*/
.content {
    margin-bottom: 35px;
}

/*文本域,护眼绿*/
.el-textarea__inner {
    background: #C7EDCC;
}

/*输入框,护眼绿*/
/*.el-input__inner {
    background: #C7EDCC;
    border: 1px solid #409EFF;
    height: 35px;
}*/

/*改变placeholder颜色*/
.el-input__inner::-webkit-input-placeholder {
    /* WebKit browsers */
    color: gray;
}

/*网上找的方法实现,高度控制,最小41px*/
/*https://www.cnblogs.com/secretAngel/p/10241791.html*/
.el-table__header tr,
.el-table__header th {
    padding: 0;
    height: 20px;
}

.el-table__body tr,
.el-table__body td {
    padding: 0;
    height: 20px;
}

.container {
    background-color: white;

    .header, .body {
        text-align: center;
        border: 1px solid;
        box-sizing: border-box;
    }
}
</style>
