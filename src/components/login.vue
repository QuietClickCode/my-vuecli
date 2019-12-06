<template>
    <div id="apps">
        <!--登录框-->
        <div @keyup.enter="login" style="width: 300px" class="center">
            <el-form :rules="rules" :model="user" label-width="80px" :label-position="labelPosition">
                <el-form-item prop="username" label="用户名">
                    <el-input style="width: 200px" placeholder="登录" autofocus v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input style="width: 200px" autofocus type="password" v-model="user.password"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import * as mylogin from '@/assets/my-login'

export var store = {
    labelPosition: 'right',
    user: { username: '', password: '' },
    rules: {
        username: { required: true, message: '用户名不能为空', trigger: 'blur' },
        password: { required: true, message: '密码不能为空', trigger: 'blur' }
    }
}
export default {
    name: 'login',
    data () {
        return store
    },
    methods: {
        /*用户名或者密码任意一个点击enter都会触发*/
        login: function () {
            //my-login.js通过回调获取ip,系统信息,位置信息等
            mylogin.getLocation(mylogin.cb, this)
        },
        /*my-login.js中的app.tologin(store.user, result, localIp)
        * result:包含经度X,纬度Y,省市区,和公网IP
        * getBrowserInfo():获取浏览器类型,版本,操作系统类型
        * pcOrPhone:获取设备类型,pc或者手机
        * */
        tologin: function (user, location, localIp) {
            if (user.username != '' && user.password != '') {
                var vueThis = this
                axios({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: 'api' + '/tologin',
                    method: 'post',
                    data: JSON.stringify({
                        'user': user,
                        'location': location,
                        'browserInfo': mylogin.getBrowserInfo(),
                        'pcOrPhone': mylogin.pcOrPhone(),
                        'localIp': localIp
                    }),
                })

                    .then(function (response) {
                        if (response.data.status == 0) {
                            /*window.location.href = '/#' + |response.data.url*/
                            sessionStorage.setItem('userToken', response.data.msg)
                            localStorage.setItem('token', response.data.msg)
                            vueThis.$router.push('/' + response.data.url)
                        } else {
                            vueThis.$message(response.data.msg)
                        }
                    })
                    .catch(function (error) {
                        console.log(vueThis.items + '-=================')
                    })
            }
        }
    }
}
</script>

<style>
/*登录框水平居中*/
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
