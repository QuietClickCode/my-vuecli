<template>
    <div id="mdeditor">
        <div style="text-align: center">标题</div>
        <mavon-editor id="title" v-model="title" :toolbars="toolbars"/>
        <div style="text-align: center;">正文</div>
        <mavon-editor id="content" v-model="content" :toolbars="toolbars"/>
        <div style="position:fixed;bottom: 10px;left:600px;z-index:1000000">
            <el-button @click="save">保存</el-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'markdown',
    data () {
        return {
            title: ' ', // 输入的数据
            content: ' ', // 输入的数据
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                mark: true, // 标记
                superscript: true, // 上角标
                quote: true, // 引用
                ol: true, // 有序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                help: true, // 帮助
                code: true, // code
                subfield: true, // 是否需要分栏
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                /* 1.3.5 */
                undo: true, // 上一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true // 导航目录
            }
        }
    },
    methods: {
        save: function () {
            var vueThis = this
            axios({
                url: process.env.HOST+"/savemarkdown",
                method: 'post',
                data: { 'title': vueThis.title, 'content': vueThis.content },
            })
                .then(function (response) {
                    vueThis.$message(response.data)
                })
                .catch(function (error) {
                    console.log('--------------------')
                    console.log(error)
                })
        }
    }
}
</script>

<style lang="scss">
#title {
    height: 50px; /*至少300px*/
}

#content {
    height: 500px;
}
</style>
