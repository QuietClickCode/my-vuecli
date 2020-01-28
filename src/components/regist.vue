<template>
    <div id="apps">
        <!--登录框-->
        <div @keyup.enter="regist" style="width: 300px" class="center">
            <el-form :rules="rules" :model="user" label-width="80px" :label-position="labelPosition">
                <el-form-item prop="username" label="用户名">
                    <el-input style="width: 200px" placeholder="注册" autofocus v-model="user.username"></el-input>
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
import * as myregist from '@/assets/my-regist'

export var store = {
    labelPosition: 'right',
    user: { username: '', password: '' },
    rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }, {
            validator: validateUsername,
            trigger: 'blur'
        }],
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
        regist: function () {
            //my-regist.js通过回调获取ip,系统信息,位置信息等
            myregist.getLocation(myregist.cb, this)
        },
        /*my-login.js中的app.tologin(store.user, result, localIp)
        * result:包含经度X,纬度Y,省市区,和公网IP
        * getBrowserInfo():获取浏览器类型,版本,操作系统类型
        * pcOrPhone:获取设备类型,pc或者手机
        * */
        toregist: function (user, location, localIp) {
            if (user.username != '' && user.password != '') {
                var vueThis = this
                axios({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: 'https://114.55.94.186' + '/toregist',
                    method: 'post',
                    data: JSON.stringify({
                        'user': user,
                        'location': location,
                        'browserInfo': myregist.getBrowserInfo(),
                        'pcOrPhone': myregist.pcOrPhone(),
                        'localIp': localIp
                    }),
                })
                    .then(function (response) {
                        if (response.data.status == 0) {
                            vueThis.$message(response.data.msg)
                            setTimeout(function () {
                                /*window.location.href = response.data.url;*/
                                vueThis.$router.push('/' + response.data.url)
                            }, 2000)
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

//自定义校验
function validateUsername (rule, value, callback) {
    axios({
        url: 'https://114.55.94.186' + '/validateUsername?username=' + value,
        method: 'get'
    })
        .then(function (response) {
            if (response.data.status == 0) {
                callback()
            } else {
                callback(response.data.msg)
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    /*$.ajax({
        url: "validateUsername",
        contentType: "application/json",
        data: {
            "username": value,
        },
        success: function (data) {
            if (data.status == 0) {
                callback()
            } else {
                callback(data.msg)
            }
        }
    })*/
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
