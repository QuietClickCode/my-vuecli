<template>
    <div id="app" class="center">
        <el-input autofocus style="width: 500px" v-model="this.keyword"></el-input>
    </div>
</template>

<script>
export default {
    name: 'index',
    created:function() {
    },
    mounted:function() {
    },
    data () {
        return {
            keyword: ''
        }
    }
}
</script>

<style>
#app {
    text-align: center;
}

/*输入框水平居中*/
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

</style>
