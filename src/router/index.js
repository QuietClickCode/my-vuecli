import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import first from '@/components/first'
import mdeditor from '@/components/mdeditor'
import editor from '@/components/editor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
      path: '/editor',
      name: 'editor',
      component: editor
    }

  ]
})
