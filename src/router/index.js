import Vue from 'vue'
import Router from 'vue-router'
import first from '@/components/first'
import ainotelist from '@/components/ainotelist'
import index from '@/components/index'
import editorlist from '@/components/editorlist'
import article from '@/components/article'
import detail from '@/components/detail'
import login from '@/components/login'
import systemloglist from '@/components/systemloglist'
import mdeditor from '@/components/mdeditor'
import editor from '@/components/editor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '/index',
      component: index
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
      path: '/ainotelist',
      name: 'ainotelist',
      component: ainotelist
    },
    {
      path: '/first',
      name: 'first',
      component: first
    },
    {
      path: '/mdeditor',
      name: 'mdeditor',
      component: mdeditor
    },
    {
      path: '/index',
      name: 'index',
      component: index
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
      path: '/systemloglist',
      name: 'systemloglist',
      component: systemloglist
    },
    {
      path: '/editor',
      name: 'editor',
      component: editor
    }

  ]
})
