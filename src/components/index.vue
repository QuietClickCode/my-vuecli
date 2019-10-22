<template>
<div id="app">
<el-input v-model="keyword"></el-input>
</div>
</template>

<script>
export default {
name: 'index',
data() {
return {
keyword: '我是首页'
}
}
}
</script>

<style>
#first {
color: red;
}
</style>
