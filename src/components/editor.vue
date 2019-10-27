<template>
    <div id="editor">
        <div style="text-align: center">标题</div>
        <el-row>
            <quill-editor id="title" v-model="title"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)">
            </quill-editor>
        </el-row>
        <div style="text-align: center;padding-top: 50px">正文</div>
        <el-row>
            <quill-editor id="content" v-model="content"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @change="onEditorChange($event)">
            </quill-editor>
        </el-row>
        <div style="position:fixed;bottom: 10px;left:600px;">
            <el-button @click="save">保存</el-button>
        </div>
    </div>

</template>
<script>
import axios from 'axios'
export default {
    name: 'editor',
    data: function () {
        return {
            title: '',
            content: '',
            editorOption: {}
        }
    },
    methods: {
        save: function () {
            var vueThis = this
            axios({
                url: '/saveeditor',
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
        },
        onEditorBlur (editor) { // 失去焦点事件
        },
        onEditorFocus (editor) { // 获得焦点事件
        },
        onEditorChange ({ editor, html, text }) { // 编辑器文本发生变化
// this.content可以实时获取到当前编辑器内的文本内容
            console.log(this.content)
        }
    }
}
</script>

<style>
#title {
    height: 50px;
}

#content {
    height: 500px;
}
</style>
