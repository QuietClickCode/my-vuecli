<template>
    <div>
        <el-alert
            title="成功提示的文案"
            type="success"
            effect="dark">
        </el-alert>

        <el-timeline :reverse="reverse">
            <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp">
                {{activity.content}}
            </el-timeline-item>
        </el-timeline>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>卡片名称</span>
                <button style="float: right; padding: 3px 0" type="text">操作按钮</button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
        <div class="block">
            <span class="demonstration">默认 Hover 指示器触发</span>
            <el-carousel height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>
<script>
    import ElCarouselItem from "../element/carousel/src/item"
    import ElCarousel from "../element/carousel/src/main"
    import ElTabs from "../element/tabs/src/tabs"
    import ElTabPane from "../element/tabs/src/tab-pane"
    import ElTimeline from "../element/timeline/src/main"
    import ElCard from "../element/card/src/main"
    import ElTimelineItem from "../element/timeline/src/item"
    import ElAlert from "../element/alert"

    export default {
        name: 'alert',
        components: {
            ElTimeline,
            ElTimelineItem,
            ElCard,
            ElAlert,
            ElTabs,
            ElTabPane,
            ElCarouselItem,
            ElCarousel
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        },
        data() {
            return {
                activeName: 'second',
                reverse: true,
                activities: [{
                    content: '活动按期开始',
                    timestamp: '2018-04-15'
                }, {
                    content: '通过审核',
                    timestamp: '2018-04-13'
                }, {
                    content: '创建成功',
                    timestamp: '2018-04-11'
                }]
            }
        },
        props: {
            dataList: {
                type: Array,
                default:
                    function () {
                    }
            },
            timelineColor: { // 组建背景颜色
                type: String,
                default:
                    '#5bbcd5'
            }
            ,
            timeContentColor: {
                type: String,
                default:
                    '#f2f2f2'
            }
        },
        filters: {
            formatDate(time) {
                return parseTime(time, '{y}年{m}月{d} {h}:{i}')
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    #hzqing {
        list-style: none;
        position: relative;
        padding: 20px;
        margin: 0 auto;
        overflow: hidden;
        background: var(--timelineColor);
        font-family: "微软雅黑", Arial, Helvetica, sans-serif;
        .timeline-row {
            padding-left: 50%;
            z-index: 10;
            position: relative;
            .timeline-time {
                position: absolute;
                right: 50%;
                text-align: right;
                margin-right: 60px;
                font-size: 17px;
                line-height: 35px;
                top: 40px;
            }
            .timeline-img {
                position: absolute;
                top: 30px;
                left: 49%;
                margin-left: -15px;
                width: 60px;
                height: 60px;
                text-align: center;
                overflow: hidden;
                padding: 3px;
                font-size: 14px;
                z-index: 100;
            }
            .timeline-content {
                position: relative;
                background: var(--timeContentColor);
                color: #333333;
                border-radius: 5px;
                margin-right: 0px;
                margin-left: 60px;
                margin-bottom: 20px;
                min-height: 80px;
                .content-body {
                    padding: 15px 15px 2px;
                    position: relative;
                    z-index: 10;
                    h2 {
                        font-size: 20px;
                        margin-bottom: 12px;
                        margin-top: 0;
                        line-height: 15px;
                        font-weight: 600;
                    }
                    p {
                        margin: 0px 0px 15px;
                    }
                }
            }
            .timeline-content:after {
                content: "";
                position: absolute;
                top: 60px;
                left: -60px;
                height: 4px;
                width: 80px;
                background-color: rgba(0, 0, 0, 0.2);
                z-index: -1;
            }
        }
        .timeline-row:nth-child(odd) { // 奇数样式
            padding-left: 0;
            padding-right: 50%;
            .timeline-time {
                right: auto;
                left: 50%;
                text-align: left;
                margin-right: 0;
                margin-left: 60px;
            }
            .timeline-content {
                margin-right: 60px;
                margin-left: 0px;
            }
            .timeline-content:after {
                left: auto;
                right: -60px;
            }
        }
        @media screen and (max-width: 1200px) {
            .timeline {
                .timeline-row {
                    position: relative;
                    right: auto;
                    top: 0;
                    margin: 0 0 6px 56px;
                    padding: 0;
                    margin-bottom: 16px;
                }
                .timeline-row:nth-child(odd) {
                    padding-right: 0;
                    .timeline-content {
                        margin-right: 0px;
                        margin-left: 40px;
                    }
                    .timeline-time {
                        position: relative;
                        right: auto;
                        left: auto;
                        top: 0;
                        text-align: left;
                        margin: 0 0 0px 40px;
                    }
                }
                .timeline-img {
                    top: 40px;
                    left: -55px;
                    margin-left: 0;
                    padding: 0px;
                }
                .timeline-time {
                    position: relative;
                    right: auto;
                    left: auto;
                    top: 0;
                    text-align: left;
                    font-size: 15px;
                    margin: 0 0 0px 40px;
                }
                .timeline-content {
                    margin-left: 40px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    position: relative;
                }
                .timeline-content:after {
                    right: auto !important;
                    left: -65px !important;
                    top: 30px;
                }
            }
            .timeline:after {
                left: 50px;
            }

        }
    }

    .timeline:after {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        height: 100%;
        width: 4px;
        border-radius: 2px;
        margin-left: -2px;
        display: block;
    }

</style>
