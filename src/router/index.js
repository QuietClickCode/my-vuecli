import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import ainotelist from '@/components/ainotelist'
import index from '@/components/index'
import list from '@/components/list'
import notfound from '@/components/notfound'
import noauth from '@/components/noauth'
import editorlist from '@/components/editorlist'
import userlist from '@/components/userlist'
import markdownlist from '@/components/markdownlist'
import article from '@/components/article'
import detail from '@/components/detail'
import login from '@/components/login'
import regist from '@/components/regist'
import loginloglist from '@/components/loginloglist'
import logoutloglist from '@/components/logoutloglist'
import systemloglist from '@/components/systemloglist'
import markdown from '@/components/markdown'
import editor from '@/components/editor'
import todo from '@/components/todo'
import picturebed from '@/components/picturebed'
import upload from '@/components/upload'
import jianshuList from '@/components/jianshuList'
import blank from '@/components/blank'
import CSDNList from '@/components/CSDNList'
import BKYList from '@/components/BKYList'
import movieList from '@/components/movieList'

Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}
export default new Router({
    /*mode: 'history',*/
    routes: [
        {
            path: '/movieList',
            name: '豆瓣电影搜索结果列表',
            component: movieList
        },
        {
            path: '/CSDNList',
            name: 'CSDN搜索结果列表',
            component: CSDNList
        },
        {
            path: '/BKYList',
            name: '博客园搜索结果列表',
            component: BKYList
        },
        {
            path: '/blank',
            name: '空白页',
            component: blank
        },
        {
            path: '/jianshuList',
            name: '简书搜索结果列表',
            component: jianshuList
        },
        {
            path: '/upload',
            name: '上传文件',
            component: upload
        },
        {
            path: '/',
            name: '/index',
            component: index
        },
        {
            path: '/todo',
            name: '待办事项',
            component: todo
        },
        {
            path: '/detail',
            name: 'detail',
            component: detail
        },
        {
            path: '/editorlist',
            name: 'editorlist',
            component: editorlist
        },
        {
            path: '/loginloglist',
            name: 'loginloglist',
            component: loginloglist
        },
        {
            path: '/noauth',
            name: 'noauth',
            component: noauth
        },
        {
            path: '/logoutloglist',
            name: 'logoutloglist',
            component: logoutloglist
        },
        {
            path: '/ainotelist',
            name: 'ainotelist',
            component: ainotelist
        },
        {
            path: '/list',
            name: 'list',
            component: list
        },
        {
            path: '/markdown',
            name: 'markdown',
            component: markdown
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/userlist',
            name: 'userlist',
            component: userlist
        },
        {
            path: '/article',
            name: 'article',
            component: article
        },
        {
            path: '/login',
            name: 'login',
            component: login

        },
        {
            path: '/regist',
            name: 'regist',
            component: regist
        },
        {
            path: '/picturebed',
            name: '图床',
            component: picturebed
        },
        {
            path: '/markdownlist',
            name: 'markdownlist',
            component: markdownlist
        },
        {
            path: '/systemloglist',
            name: 'systemloglist',
            component: systemloglist,
            beforeEnter: (to, from, next) => {
                axios({
                    url: process.env.HOST+'/issystemloglistpermission',
                    method: 'post'
                })
                    .then(function (response) {
                        if (response.data.status == 0) {
                            next()
                        } else {
                            var url = response.data.url
                            next(url)
                        }
                    })
                    .catch(function (error) {
                        console.log('--------------------')
                        console.log(error)
                    })
            }
        },
        {
            path: '/editor',
            name: 'editor',
            component: editor
        },
        {
            path: '/404',
            name: 'notfound',
            component: notfound
        }, {
            path: '*', // 此处需特别注意置于最底部
            redirect: '/404'
        }

    ]
})
