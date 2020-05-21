<template>
    <div id="app">
        <mindmap
            v-model="data"
        ></mindmap>
    </div>
</template>

<script>
    import mindmap from '@hellowuxin/mindmap'

    export default {
        name: 'App',
        components: {
            mindmap
        },
        data: () => ({
            data: [{
                'name': '如何学习D3',
                'children':
                    [
                        {
                            'name': '预备知识',
                            'children':
                                [
                                    {'name': 'HTML & CSS', 'children': []},
                                    {'name': 'JavaScript', 'children': []}]
                        },
                        {
                            'name': '安装',
                            'children': []
                        }
                    ]
            }]
        })
    }
</script>
