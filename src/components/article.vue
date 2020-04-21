<template>
    <div class="article">
        <!--音乐播放器插件-->
        <!-- <div class="aplayer" id="player" style="display: block;color:black"
              data-id="402192905"
              data-fixed="true"
              data-server="netease"
              data-volume="0.4"
              data-type="playlist">
         </div>-->
        <meting-js
            style="display: none"
            fixed="true"
            server="netease"
            type="playlist"
            id="402192905">
        </meting-js>
        <a href="#top" style="position:fixed;right:100px;bottom:100px;z-index:100;"><i class="fa fa-2x fa-arrow-up"
                                                                                       aria-hidden="true"></i></a>
        <a style="position:fixed;right:100px;top:100px;z-index:100;"><i @click="music" class="fa fa-2x fa-music"
                                                                        aria-hidden="true"></i></a>
        <a style="position:fixed;right:10px;bottom:5px;z-index: 10000"><span>{{date}}</span></a>
        <div style="display:inline;">
            <div style="position:fixed; top: 32px; left: 8px;z-index:10;">
                <el-select v-model="platform" filterable placeholder="请选择">
                    <el-option
                        label="csdn"
                        value="article">
                    </el-option>
                    <el-option
                        label="简书"
                        value="jianshu_article">
                    </el-option>
                    <el-option
                        label="博客园"
                        value="bky_article">
                    </el-option>
                </el-select>
                <el-input v-model="id" placeholder="输入文章编号" style="margin-bottom:5px;width: 200px"></el-input>
                <el-input v-model="title" placeholder="输入文章标题" style="margin-bottom:5px;width: 200px"></el-input>
                <i @click="back" class="fa fa-x fa-arrow-left" style="font-size: 24px" aria-hidden="true"></i>
                <span style="color: gray ">上一篇</span>
                <span style="color: gray ">|</span>
                <span style="color: gray ">下一篇</span>
                <i @click="next" class="fa fa-x fa-arrow-right" style="font-size: 24px" aria-hidden="true"></i>
                <el-button @click="queryArticle">查询</el-button>
            </div>
            <div id="top" style="height: 30px;"></div>
            <div style="display: block;text-align: center;height:40px">
                <el-button @click="toggleFullScreen"
                           style="position:fixed; top:0; left:0;z-index:100;width:100%;height:35px;"
                           type="success">{{articledetail.id}} | {{articledetail.title}} | {{articledetail.createtime}}
                </el-button>
            </div>

            <el-table max-height="250" id="table"
                      :data="article"
                      :row-style="rowstyle"
                      style="width: 100%;position:fixed; bottom:35px; left:0;z-index:10;">
                <el-table-column
                    prop="id"
                    label="id" min-width="50px"
                ></el-table-column>
                <el-table-column
                    prop="title"
                    label="标题" min-width="100px"
                >
                </el-table-column>
                <el-table-column
                    label="详情" min-width="100px"
                >
                    <template slot-scope="scope">
                        <el-button @click="view(scope.row.id)" type="text">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content">
                <!--//以前的显示文本框-->
                 <el-input v-model="articledetail.content" type="textarea" autosize readonly
                           style="color: #C7EDCC;"></el-input>
                <!--富文本编辑器-->
                <!--<quill-editor
                    v-model="articledetail.content"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                </quill-editor>-->
            </div>

            <div style="display: block;text-align: center">
                <a href="#topAnchor" style="position:fixed;right:0;bottom:0">回到顶部</a>
                <el-button style="position:fixed; bottom:0; left:0;width:100%;height:35px;" type="success"
                           @click="closetable">文章列表
                </el-button>
            </div>
        </div>
    </div>

</template>
<script>
    import axios from 'axios'
    import $ from 'jquery'
    import { quillEditor } from 'vue-quill-editor'
    var store = {
        editor: null,
        editorContent: '',
        articledetail: '',
        article: [],
        IsShow: false,
        platform: 'article',
        id: '',
        title: '',
        rowstyle: {
            height: 50
        },
        date: '',
        content: null,
        editorOption: {}
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
                /* 不加动画或者,时间太少,都回补了顶部,这个速度可以滑到顶部,并且不影响后面的手动下滑 */
                $('html,body').animate({scrollTop: 0}, 500)
                /* this.toggleFullScreen(); */

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
            // 清楚样式
            $('body').css('background-color', 'white')
            $('.el-textarea__inner').css('background', 'white')
            $('.el-input__inner').css('background', 'white')
            if (this.timer) {
                clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
            }
        },
        methods: {
            onEditorBlur () { // 失去焦点事件
            },
            onEditorFocus () { // 获得焦点事件
            },
            onEditorChange () { // 内容改变事件
            },
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
                    url: process.env.HOST + '/queryarticle',
                    method: 'post',
                    data: {
                        'id': store.id,
                        'keyword': store.keyword,
                        'title': store.title,
                        'content': store.content,
                        'platform': store.platform
                    }
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
                    url: process.env.HOST + '/queryarticle',
                    method: 'post',
                    data: {
                        'id': id,
                        'keyword': store.keyword,
                        'title': store.title,
                        'content': store.content,
                        'platform': platform
                    }
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
                /* window.location = "http://music.nbclass.com/" */
                this.IsShow = !this.IsShow
                if (this.IsShow) {
                    $('#402192905').show()
                } else {
                    $('#402192905').hide()
                }
            },
            toggleFullScreen: function () {
                if (!document.fullscreenElement && // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
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

<style lang="scss">

    @import "../assets/css/font-awesome-4.7.0/css/font-awesome.min.css";
    @import "../assets/css/APlayer.min.css";
    .article {

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
    }
</style>
