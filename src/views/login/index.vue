<template>
    <div>
        <!--登录框-->
        <div @keyup.enter="login" style="width: 300px" class="center">
            <el-form :rules="rules" :model="store.user" label-width="80px" :label-position="labelPosition">
                <el-form-item prop="username" label="用户名">
                    <el-input style="width: 200px" placeholder="登录" autofocus v-model="store.user.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input style="width: 200px" autofocus type="password" v-model="store.user.password"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
  export default {
    components: {},
    name: 'login',
    data() {
        return {
            labelPosition: 'right',
            user: {username: "", password: ""},
            rules: {
                username:{ required: true, message: '用户名不能为空', trigger: 'blur' },
                password:{ required: true, message: '密码不能为空', trigger: 'blur' }
            }
        }
    },
    methods: {

    },
  }
</script>

<style scoped>
/*登录框水平居中*/
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>

