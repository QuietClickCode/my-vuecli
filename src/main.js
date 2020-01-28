// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'

Vue.prototype.$axios = axios
axios.defaults.withCredentials = true
/*axios.defaults.baseURL = 'https://114.55.94.186'*/  //关键代码
// use
Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 添加请求拦截器
let token = localStorage.getItem('token')
axios.interceptors.request.use(
    config => {
        if (token) {
            config.headers.token = token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
router.beforeEach((to, from, next) => {
    // to,from,next 3个参数
    // to: Route， 即将要进入的路由对象
    // from: Route， 当前导航将要离开的路由对象
    // next: Function， 切记要调用该函数来resolve这个钩子，里面可以写自己想要的参数
    // 1、next(): 进行管道中的下一个钩子函数，如果全部钩子函数执行完，导航的状态就说明确认了
    // 2、next(false): 中断当前导航，重置到from路由对应的地址
    // 3、next('/drinks'): 或者next({path:'/drinks'}): 当前导航被中断，跳转到指定的路由
    // 4、next(error): 如果传入参数是Error的实例，导航会被终止且该错误会被传递给router.onError()注册过的回调
// 这里可以写逻辑判断，比如没有登录，点击某个tab就跳转到登录页面
    if (to.path == '/login') {
        next()
    } else {
        /*sessionStorage.setItem('userToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ6amoifQ.WduZcdFyZSMdrx82JOYFbAKoDPQ4evDFPvt6i6USK5Y')*/
        //暂时不登录
        next();
       /* if (sessionStorage.getItem('userToken') == null) {
            router.app.$router.push('/login')
        } else {

            next()
        }*/
    }

})
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})
