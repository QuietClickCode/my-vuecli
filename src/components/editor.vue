<template>
<div id="editor">
<h1>我是编辑器</h1>
<el-row>
<quill-editor v-model="content"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)">
</quill-editor>
</el-row>
</div>

</template>
<script>
import {quillEditor} from 'vue-quill-editor'

export default {
name: 'editor',
data: function () {
return {
content: '',
editorOption: {}
}
},
methods: {
onEditorBlur (editor) { // 失去焦点事件
},
onEditorFocus (editor) { // 获得焦点事件
},
onEditorChange ({editor, html, text}) { // 编辑器文本发生变化
// this.content可以实时获取到当前编辑器内的文本内容
console.log(this.content)
}
}
}
</script>

<style>
.quill-editor {
height: 350px;
}
</style>
