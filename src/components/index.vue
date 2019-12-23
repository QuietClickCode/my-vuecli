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
                <ol>
                    <li v-for="(item,i) in data" style="background-color: #DCDFE6">
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
                        <p>主演:{{item.actor_count}} <span v-for="item_,i_ in item.actors"
                                                         v-html="item_">{{item_+'/'}}</span>
                        </p>
                        <p>类型:<span v-for="item_1,i_1 in item.types" v-html="item_1">{{item_1}}</span></p>
                        <p>制片国家/地区:<span v-for="item_2,i_2 in item.regions" v-html="item_2">{{item_2}}</span></p>
                        <p>上映日期:{{item.release_date}}</p>
                        <p>{{item.vote_count}}人评价</p>
                        <p>下载地址:<a :href="item.url">{{item.url}}</a></p>
                        <p>暂无简介</p>
                    </li>
                </ol>
            </section>
            <div style="display: inline-block;position: fixed;bottom: 10px;left: 600px;">
                <el-button id="prev" :disabled="isPrev" @click="prev(searchkeyword,result.pageNo-1)">上一页</el-button>
                <el-button id="next" :disabled="isNext" @click="next(searchkeyword,result.pageNo+1)">下一页</el-button>
            </div>
        </div>
        <div id="articleresult" style="display: none">
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
            <div style="display: inline-block;position: fixed;bottom: 10px;left: 600px;">
                <el-button id="prevArticle" :disabled="isPrevArticle"
                           @click="prevarticle(articlesearchkeyword,articleresult.pageNo-1)">上一页
                </el-button>
                <el-button id="nextArticle" :disabled="isNextArticle"
                           @click="nextarticle(articlesearchkeyword,articleresult.pageNo+1)">下一页
                </el-button>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'

var store = {
    bookArray: [],
    bookcontent: '圣诞节后的第二个早晨，我怀着祝贺佳节的心情，前往探看我的朋友歇洛克·福尔摩斯。他身穿一件紫红色睡衣懒散地斜靠在一张长沙发上，右手边放着一个烟斗架，眼前还有一堆折皱了的晨报，显然是刚刚翻阅过的。沙发旁是一把木椅，椅子靠背上挂着一顶肮脏的褴褛不堪的硬胎毡帽。帽子简直糟得不能再戴了，有好几处都裂了缝。椅垫上放着一个放大镜和一把镊子，这说明那顶帽子之所以用这样的方式挂着，目的是为了便于检查。\n' +
        '“你正忙着呢，”我说，“也许我打搅你了。”\n' +
        '“没有的话，我很兴奋有一位朋友来和我一AE?讨论我研究所得的结果。这完全是一件毫无价值的东西。"说着，他竖AE?大拇指指了一下那顶帽子，“不过，同它有关联的几个题目却不是索然无味的，甚至还能给我们一些教益。”\n' +
        '*我坐在他那张扶手椅上，就着木柴劈啪作响的炉火热热自己的双手，由于严冷已经降临，窗户上的玻璃都结了晶莹的冰凌。"我猜想，"我说道，“尽管这顶帽子很不雅，但它却和某桩性命攸关的事故有所牵连，就是这条线索能引导你解开某个疑团，并且指导你往惩罚某种犯罪行为。”\n' +
        '“不，不，并非犯罪行为，"歇洛克·福尔摩斯笑着说，“这只不过是很多离奇的小事中的一件罢了。在一块仅有几平方英里的弹丸之地，拥挤不堪地住着四百万人口，这类小事是少不了的。在如此稠密的人群尔虞我诈的争逐中，各种错综复杂的事件都是可能发生的；有些疑难题目看AE?来很惊人和稀奇古怪，但并非就是犯罪行为。我们对于诸如此类的事件是早有经验的了。”\n' +
        '“是的，甚至到了这样的程度，”我说，“那就是我记录上最近增添的六个案件中，倒有三个完全与法律上的犯罪行为无关。”\n' +
        '“确切地说，你指的是我找回艾琳·艾德勒相片的尝试，玛丽·萨瑟兰小姐奇案和歪唇男人这几个案件吧。我不怀疑这件小事也属于法律上无罪的范畴。你熟悉看门人彼得森吗？”\n' +
        '“熟悉。”\n' +
        '“这就是他的战利品。”\n' +
        '“这是他的帽子？”\n' +
        '“不，不是。是他拣来的。帽主是谁尚未知晓。但请不要由于它只不过是一顶破毡帽而轻易视之，而应当把它当作一个需要智力才能解决的疑难题目来看待。首先说说这顶帽子的来历。它是连同一只大肥鹅一AE?在圣诞节早晨送到这里来的。我相信，此鹅现时正在彼得森的炉前烧烤。事情是这样的：圣诞节破晓大约四点钟的时候，彼得森，正如你所知道的，为人淳朴老实，在某处参加了一个小小的欢宴之后正在回家途中，他是取道托特纳姆法院路走回家往的。在煤气灯下，他看见一个身材颇高的人在他前面走着，步伐有些蹒跚，肩上背着一只白鹅。当彼得森途经古治街拐角时，这个陌生人忽然和几个流氓发生了一场争吵。一个流氓把他的帽子打落在地，为此他抡AE?棍子进行自卫，他高举棍子四处挥舞，一下子把身后商店的玻璃橱窗打得粉碎。彼得森正想挺身而出，助这个陌生人一臂之力以对付这帮无赖，但那个陌生人正因打坏玻璃而感到惊慌，同时又瞧见一个身穿制服、状如警官的人冲他而来，于是把鹅丢下，拔腿就跑，很快地消失在托特纳姆法院路后面弯弯曲曲的小巷里。那帮流氓看见彼得森正在赶来也逃之夭夭了。这样，只留下了彼得森在那里，不仅占领了战场，而且掳获了这两样战利品：一顶破旧的毡帽和一只上等的圣诞大肥鹅。”\n' +
        '“他无疑是想把这些东西回还原主的吧？”\n' +
        '“我亲爱的伙伴，困难就出在这里。的确，这只鹅的左腿上系着一张写着\'献给亨利·贝克夫人\'的小卡片，而且这顶帽子的衬里也的确写着姓名缩写\'H．B．\'的字样，但是，在我们这个城市里，姓贝克（Ｂａｋｅｒ）的人数以千计，而名叫亨利·贝克（ＨｅｎｒｙＢａｋｅｒ）的人又何止数百，所以要在这很多人中间找到失主，把东西回还给他，决不是一件轻易的事。”\n' +
        '“那么，后来彼得森怎么办呢？”\n' +
        '“由于他知道我对那些即使是最细小的题目也是很感爱好的，所以就在圣诞节早晨带着帽子和鹅到我这里来了。这只鹅我们一直留到今天早晨。尽管天气较冷，但有些迹象表明最好还是把它吃掉，没有必要再拖延了。因此彼得森带走它，往完成一只鹅的终极命运，而我则继续保存着这位失往了圣诞节佳馔的素未谋面的先生的帽子。”\n' +
        '“他没有在报纸上刊登寻找失物的AE?事吗？”\n' +
        '“没有。”\n' +
        '“那么，关于这个人的身份你有什么线索吗？”\n' +
        '“只有尽我们所能往推测。”\n' +
        '“从这顶帽子上？”\n' +
        '“对。”\n' +
        '“你真是会开玩笑，从这顶又破又旧的毡帽上你能推测出什么来？”\n' +
        '“这是我的放大镜，你素来知道我的方法。对于戴这顶帽子的那个人的个性，你能够推测出什么来吗？”\n' +
        '*我把这顶褴褛帽子拿在手里，无可奈何地把它翻过来看看，这是一顶极其普通的圆形黑毡帽，硬邦邦的而且破旧得不堪再戴了。原来的红色丝绸衬里已经大大褪色，上面没有制帽商的商标，但是正象福尔摩斯说过的，在帽子的一侧，却有潦草涂写的姓名缩写字母\'H．B．\'。为了防止被风刮跑，帽檐曾穿有小孔，但上面的松紧带已经没有了。至于其它情况，尽管似乎是为了掩盖帽子上几块褪了色的补丁而用墨水把它们涂黑了，但还是到处开裂，布满灰尘，有好几个地方污点斑斑。\n' +
        '“我看不出什么来。"我一面说着，一面把帽子递还我的朋友。\n' +
        '“恰恰相反，华生，你什么都能看出来，可是，你没有从所看到的东西作出推论。你对作出推论太缺乏信心了。”\n' +
        '“那么，请你告诉我你能够从这顶帽子作出什么推论呢？”\n' +
        '*他拿起帽子，并用他那独特的、足以表示他的性格的思考方式注视着它。“这顶帽子可能提供的引人联想的东西也许要少一些，"他说道，“不过，还是有几点推论是很明显的，而其它几点推论至少或然率是很大的。从帽子的外观来看，很明显这个人是个学问渊博的人，而且在过往三年里，生活相当富裕，尽管他目前已处于窘境。他过往很有远见，可是，已今非昔比，再加上家道中落，因此，精神日趋颓废，这仿佛说明了他受到某种有害的影响，也许染上了酗酒的恶习，恐怕这也是他AE?子已不再爱他这一明显事实的原因。”',
    obj: [],
    obj4: [],
    haha: 1,
    count: 0,
    duration: 0,
    //是否禁用
    isPrev: false,
    isNext: false,
    isPrevArticle: false,
    isNextArticle: false,
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
    articledata: [],
    result: {},
    articleresult: {},
    searchkeyword: '',
    articlesearchkeyword: '',
    platform: '',
    searchurl: '',
    articleCurrentPage: ''
}
export default {
    name: 'index',
    data () {
        return store
    },
    mounted: function () {
        //实现返回回到最初的浏览位置
        if (this.keword != '') {
            this.nextarticle(this.articlesearchkeyword, this.articleCurrentPage)
        }
    },
    methods: {
        randomString: function (len) {
            len = len || 32
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length
            var pwd = ''
            for (var i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
            }
            return pwd
        },
        closehaha: function () {
            this.obj.close()
        },
        //右上角系统弹出的消息
        open4 (data) {
            var temp = this.$notify({
                title: new Date().toLocaleString(),
                duration: this.duration,
                message: data,
                position: 'top-left'
            })
            this.obj.push(temp)
        },

        open3 (data) {
            var temp = this.$notify({
                title: new Date().toLocaleString(),
                duration: this.duration,
                message: data,
                position: 'top-right'
            })
            this.obj4.push(temp)
        },
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
        isNextDisabledArticle: function (page) {
            if (page * this.articleresult.size >= this.articleresult.total) {
                this.isNextArticle = true
            } else {
                this.isNextArticle = false
            }
        },
        isPrevDisabledArticle: function (page) {
            if (page <= 1) {
                this.isPrevArticle = true
            } else {
                this.isPrevArticle = false

            }
        },
        next: function (keyword, page) {
            var vueThis = this
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: '/api' + '/s?wd=' + keyword + '&pn=' + page
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
                url: '/api' + '/s' + '?wd=' + keyword + '&pn=' + page
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
        nextarticle: function (keyword, page) {
            var vueThis = this
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: '/api' + '/' + vueThis.searchurl + '?wd=' + keyword + '&pn=' + page
            })
                .then(function (response) {
                    vueThis.articleCurrentPage = page
                    vueThis.articledata = response.data.data.list
                    vueThis.articleresult = response.data.data
                    vueThis.articlesearchkeyword = response.data.msg
                    $('#articleresult').show()
                    vueThis.isNextDisabledArticle(vueThis.articleresult.pageNo)
                    vueThis.isPrevDisabledArticle(vueThis.articleresult.pageNo)
                })
                .catch(function (error) {
                    console.log(vueThis.items + '-=================')
                })
        },
        prevarticle: function (keyword, page) {
            var vueThis = this
            axios({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: '/api' + '/' + vueThis.searchurl + '?wd=' + keyword + '&pn=' + page
            })
                .then(function (response) {
                    vueThis.articleCurrentPage = page
                    vueThis.articledata = response.data.data.list
                    vueThis.articleresult = response.data.data
                    vueThis.articlesearchkeyword = response.data.msg
                    $('#articleresult').show()
                    vueThis.isNextDisabledArticle(vueThis.articleresult.pageNo)
                    vueThis.isPrevDisabledArticle(vueThis.articleresult.pageNo)
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
                    /*window.location.href = keyword.substring(1)*/
                    this.$router.push('/' + keyword.substring(1))
                } else {
                    this.other(keyword)
                }
            }
        },

        /*由enter()调用,非转发模式*/
        other: function (keyword) {
            var vueThis = this
            $('#result').hide()
            $('#articleresult').hide()
            var isNote = keyword.startsWith('\'')
            var isCommand = keyword.startsWith(':')
            /*2.便签模式*/
            if (isNote) {
                if (keyword.substring(1) == 'clear ') {
                    store.note = ''
                    store.keyword = '\''
                } else {
                    if (keyword.substring(1).length == 0) {
                        vueThis.bookArray = vueThis.bookcontent.trim().split('\n')
                        vueThis.open4(vueThis.bookArray[vueThis.count])
                        vueThis.count++
                        if (vueThis.obj.length >= 2) {
                            vueThis.obj[0].close()
                            vueThis.obj.splice(0, 1)
                        }
                    } else {

                        axios({
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'post',
                            url: '/api' + '/note',
                            data: JSON.stringify({
                                'content': keyword.substring(1)
                            }),
                        })
                            .then(function (response) {
                                if (response.data.status == 0) {
                                    if (store.note == '') {
                                        /*vueThis.bookArray = vueThis.bookcontent.trim().split('\n')*/
                                        store.note = response.data.data.concat('---').concat(new Date().toLocaleString())
                                        vueThis.open3(response.data.data)
                                        /*vueThis.open4(vueThis.bookArray[vueThis.count])*/
                                        /*vueThis.count++*/
                                    } else {

                                        store.note += '\n'.concat(response.data.data).concat('---').concat(new Date().toLocaleString())
                                        /*vueThis.duration += 10000*/
                                        vueThis.haha++
                                        vueThis.open3(response.data.data)

                                        vueThis.count++
                                        console.log(vueThis.obj.length)
                                        console.log(vueThis.obj)
                                        //只保留5个,增加一个就删除数组第一个

                                        if (vueThis.obj4.length >= 6) {
                                            vueThis.obj4[0].close()
                                            vueThis.obj4.splice(0, 1)
                                        }
                                        /*if (vueThis.haha % 2 == 0) {
                                            vueThis.open4()

                                        } else {

                                            vueThis.open3()
                                        }*/
                                    }
                                    store.keyword = '\''
                                }
                            })
                            .catch(function (error) {
                                console.log(vueThis.items + '-=================')
                            })
                    }
                }
                /*3.命令模式*/
            } else if (isCommand) {
                var vueThis = this
                var index = keyword.indexOf(' ')
                if (index != -1) {
                    /*命令关键字后面必须有空格哦*/
                    var command = keyword.substring(1, index + 1)
                    var isEnd = keyword.lastIndexOf(' ')
                    if (command == 'js ') {
                        vueThis.searchurl = 'searchjianshu'
                        var articlesearchkeyword = keyword.substring(4)
                        axios({
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'get',
                            url: '/api' + '/searchjianshu?wd=' + articlesearchkeyword
                        }).then(function (response) {
                            vueThis.articledata = response.data.data.list
                            vueThis.articleresult = response.data.data
                            vueThis.articlesearchkeyword = response.data.msg
                            vueThis.platform = 'jianshu_article'
                            $('#articleresult').show()
                            vueThis.isNextDisabledArticle(vueThis.articleresult.pageNo)
                            vueThis.isPrevDisabledArticle(vueThis.articleresult.pageNo)
                        }).catch(function (error) {
                            console.log(vueThis.items + '-=================')
                        })
                    }
                    if (command == 'csdn ') {
                        vueThis.searchurl = 'searchcsdn'
                        var articlesearchkeyword = keyword.substring(6)
                        axios({
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'get',
                            url: '/api' + '/searchcsdn?wd=' + articlesearchkeyword
                        }).then(function (response) {
                            vueThis.articledata = response.data.data.list
                            vueThis.articleresult = response.data.data
                            vueThis.articlesearchkeyword = response.data.msg
                            vueThis.platform = 'article'
                            $('#articleresult').show()
                            vueThis.isNextDisabledArticle(vueThis.articleresult.pageNo)
                            vueThis.isPrevDisabledArticle(vueThis.articleresult.pageNo)
                        }).catch(function (error) {
                            console.log(vueThis.items + '-=================')
                        })
                    }
                    if (command == 'bky ') {
                        vueThis.searchurl = 'searchbky'
                        var articlesearchkeyword = keyword.substring(5)
                        axios({
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'get',
                            url: '/api' + '/searchbky?wd=' + articlesearchkeyword
                        }).then(function (response) {
                            vueThis.articledata = response.data.data.list
                            vueThis.articleresult = response.data.data
                            vueThis.articlesearchkeyword = response.data.msg
                            vueThis.platform = 'bky_article'
                            $('#articleresult').show()
                            vueThis.isNextDisabledArticle(vueThis.articleresult.pageNo)
                            vueThis.isPrevDisabledArticle(vueThis.articleresult.pageNo)
                        }).catch(function (error) {
                            console.log(vueThis.items + '-=================')
                        })
                    }
                    if (command == 'movie ') {
                        var searchkeyword = keyword.substring(7)
                        axios({
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'get',
                            url: '/api' + '/s?wd=' + searchkeyword
                        }).then(function (response) {
                            vueThis.data = response.data.data.list
                            vueThis.result = response.data.data
                            vueThis.searchkeyword = response.data.msg
                            $('#result').show()
                            vueThis.isNextDisabled(vueThis.result.pageNo)
                            vueThis.isPrevDisabled(vueThis.result.pageNo)
                        }).catch(function (error) {
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
                                method: 'post',
                                url: '/api' + '/logout'
                            })
                                .then(function (response) {
                                    vueThis.$message(response.data.msg)
                                    setTimeout(function () {
                                            /* window.location.href = response.data.url*/
                                            sessionStorage.clear()
                                            localStorage.clear()
                                            vueThis.$router.push('/' + response.data.url)
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
                var vueThis = this
                axios({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    url: '/api' + '/todetail',
                    data: JSON.stringify({
                        'keyword': keyword
                    }),
                })
                    .then(function (response) {
                        /*window.location.href = 'detail'*/
                        vueThis.$router.push('/' + response.data.url)
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

.articlecontent {
    color: blue;
}

.articlecontent:hover {
    color: blue;
    text-decoration: underline;
}

/*半透明*/
#prevArticle {
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
    opacity: 0.6;
}

#nextArticle {
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
    opacity: 0.6;
}

#next {
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
    opacity: 0.6;
}

#prev {
    filter: alpha(Opacity=60);
    -moz-opacity: 0.6;
    opacity: 0.6;
}

.el-notification__content {
    /*width:100px;*/
    /*设置自动换行*/
    word-break: break-word;
}
</style>
