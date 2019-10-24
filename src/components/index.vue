<template>
    <div>
        <!--便签内容框放在最顶部,可清空,可无限扩展-->
        <el-input type="textarea" autosize :placeholder="data.notePlaceholder" class="textarea" v-model="data.note"
                  :style="{display:data.isSee}"
        ></el-input>
        <div class="center" @keyup.enter="enter(data.keyword)">
            <el-input autofocus id="el-input" style="width: 500px;"
                      @input="input(data.keyword)"
                      v-model="data.keyword">
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    created: function () {
    },
    mounted: function () {
    },
    data () {
        return {
            data: {
                /*模式*/
                pattern: '',
                /*便签的默认提示*/
                notePlaceholder: '写点什么吧～～',
                /*便签内容*/
                note: '',
                /*便签是否可见*/
                isSee: 'none',
                /*输入框内容*/
                keyword: '',
            }
        }
    },
    methods: {
        //enter激发
        enter: function (keyword) {
            if (keyword != '') {
                var isForward = keyword.startsWith('/')
                /*1.转发模式*/
                if (isForward) {
                    window.location.href = keyword.substring(1)
                } else {
                    this.other(keyword)
                }
            }
        }
        ,

        /*由enter()调用,非转发模式*/
        other: function (keyword) {
            var isNote = keyword.startsWith('\'')
            var isCommand = keyword.startsWith(':')
            /*2.便签模式*/
            if (isNote) {
                if (keyword.substring(1) == 'clear ') {
                    this.data.note = ''
                    this.data.keyword = '\''
                } else {
                    if (this.data.note == '') {
                        this.data.note = keyword
                    } else {
                        this.data.note = keyword
                    }
                    data.keyword = '\''
                    /*$.ajax({
                        type: 'post',
                        contentType: 'application/json',
                        url: '/note',
                        data: JSON.stringify({
                            'content': keyword.substring(1)
                        }),
                        success: function (data) {
                            if (data.status == 0) {
                                if (data.note == '') {
                                    data.note = data.data.concat('---').concat(new Date().toLocaleString())
                                } else {
                                    data.note += '\n'.concat(data.data).concat('---').concat(new Date().toLocaleString())
                                }
                                data.keyword = '\''
                            }
                        }
                    })*/
                }
                /*3.命令模式*/
            } else if (isCommand) {
                var vueThis = this
                var index = keyword.indexOf(' ')
                if (index != -1) {
                    var command = keyword.substring(1, index + 1)
                    var isEnd = keyword.lastIndexOf(' ')
                    /*退出功能*/
                    if (isEnd + 1 == keyword.length) {
                        data.pattern = ':' + command
                        if (data.pattern == ':logout ') {
                            $.ajax({
                                contentType: 'application/json;charset=utf-8',
                                url: '/logout',
                                success: function (data) {
                                    vueThis.$message(data.msg)
                                    setTimeout(function () {
                                            window.location.href = data.url
                                        }, 1000
                                    )
                                }
                            })
                        } else if ((data.pattern == ':clear ')) {
                            data.note = ''
                        }
                    }
                }
                /*正常搜索*/
            } else {
                $.ajax({
                    type: 'post',
                    contentType: 'application/json;charset=utf-8',
                    url: '/todetail',
                    data: JSON.stringify({
                        'keyword': keyword
                    }),
                    success: function () {
                        window.location.href = 'detail'
                    }
                })
            }
        }
        ,
        /*输入触发*/
        input: function (keyword) {
            /*是否"开头*/
            var isNote = keyword.startsWith('\'')
            /*是否/开头*/
            var isForward = keyword.startsWith('/')
            /*是否:开头*/
            var isCommand = keyword.startsWith(':')
            /*开启转发模式,什么都不做,不向后台提交数据*/
            if (isForward) {
                /*开启命令模式*/
            } else if (isCommand) {

                /*开启便签模式*/
            } else if (isNote) {
                this.data.isSee = 'block'
                /*关闭便签模式*/
            } else if (keyword == '') {
                this.data.isSee = 'none'
                this.data.article = []
                /*正常模式,提交关键字到后台查询*/
            } else {

            }
        }
    }
}
</script>

<style>
/*输入框水平居中*/
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
