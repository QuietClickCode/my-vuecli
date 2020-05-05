<template>
    <!--transition 属性设置元素当过渡效果，四个简写属性为：-->
    <transition name="el-alert-fade">
        <!--html 里面的 role 本质上是增强语义性，当现有的HTML标签不能充分表达语义性的时候，就可以借助role来说明。通常这种情况出现在一些自定义的组件上，这样可增强组件的可访问性、可用性和可交互性。
        role的作用是描述一个非标准的tag的实际作用。比如用div做button，那么设置div 的 role=“button”，辅助工具就可以认出这实际上是个button-->
        <!--<div role="checkbox" aria-checked="checked"></div>
        辅助工具就会知道，这个div实际上是个checkbox的角色，为选中状态。-->
        <div
            class="el-alert"
            :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
            v-show="visible"
            role="alert"
        >
            <!--/*是否展示警告图标*/-->
            <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
            <!--/*弹框内容*/-->
            <div class="el-alert__content">
                <!--/*标题还是自定义slot标题*/-->
                <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
                <!--/*自定义slot内容*/-->
                <p class="el-alert__description" v-if="$slots.default && !description">
                    <slot></slot>
                </p>
                <!--/*自定义内容*/-->
                <p class="el-alert__description" v-if="description && !$slots.default">{{ description }}</p>
                <!--/*关闭图标*/-->
                <i class="el-alert__closebtn"
                   :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable"
                   @click="close()">{{closeText}}</i>
            </div>
        </div>
    </transition>
</template>

<script type="text/babel">
    /*成功警告错误常量,分别对应不同class类样式*/
    const TYPE_CLASSES_MAP = {
        'success': 'el-icon-success',
        'warning': 'el-icon-warning',
        'error': 'el-icon-error'
    };
    export default {
        name: 'ElAlert',

        props: {
            //标题
            title: {
                type: String,
                default: ''
            },
            //描述
            description: {
                type: String,
                default: ''
            },
            //提示类型
            type: {
                type: String,
                default: 'info'
            },
            //是否可关闭
            closable: {
                type: Boolean,
                default: true
            },
            //是否可关闭
            closeText: {
                type: String,
                default: ''
            },
            //是否显示图标
            showIcon: Boolean,
            //是否居中
            center: Boolean,
            /*https://www.cnblogs.com/sxz2008/p/6432290.html*/
            /* 在js中字符串是为真的，所以会输出$2.00.

         不过为了避免以上错误的话，可以记住：

 不是false, 0, undefined, NaN, "" or null，js都认为是true;
 实际测试,字符串是true,null, undefined是false

     所以具体是用三元运算符还是用if else见仁见智，视具体情况而定吧。*/
            //选择提供的主题
            effect: {
                type: String,
                default: 'light',
                validator: function (value) {
                    return ['light', 'dark'].indexOf(value) !== -1;
                }
            }
        },

        data() {
            return {
                visible: true
            };
        },

        methods: {
            close() {
                this.visible = false;
                this.$emit('close');
            }
        },

        computed: {
            typeClass() {
                return `el-alert--${ this.type }`;
            },

            iconClass() {
                return TYPE_CLASSES_MAP[this.type] || 'el-icon-info';
            },

            isBigIcon() {
                return this.description || this.$slots.default ? 'is-big' : '';
            },

            isBoldTitle() {
                return this.description || this.$slots.default ? 'is-bold' : '';
            }
        }
    };
</script>
<style lang="scss">
    @import "../mixins/mixins";
    @import "../common/var";

    @include b(alert) {
        width: 50%;
        padding: $--alert-padding;
        margin: 0;
        box-sizing: border-box;
        border-radius: $--alert-border-radius;
        position: relative;
        background-color: $--color-white;
        overflow: hidden;
        opacity: 1;
        display: flex;
        align-items: center;
        transition: opacity .2s;

        @include when(light) {
            .el-alert__closebtn {
                color: $--color-text-placeholder;
            }
        }

        @include when(dark) {
            .el-alert__closebtn {
                color: $--color-white;
            }
            .el-alert__description {
                color: $--color-white;
            }
        }

        @include when(center) {
            justify-content: center;
        }

        @include m(success) {
            &.is-light {
                background-color: $--alert-success-color;
                color: $--color-success;

                .el-alert__description {
                    color: $--color-success;
                }
            }

            &.is-dark {
                background-color: $--color-success;
                color: $--color-white;
            }
        }

        @include m(info) {
            &.is-light {
                background-color: $--alert-info-color;
                color: $--color-info;
            }

            &.is-dark {
                background-color: $--color-info;
                color: $--color-white;
            }

            .el-alert__description {
                color: $--color-info;
            }
        }

        @include m(warning) {
            &.is-light {
                background-color: $--alert-warning-color;
                color: $--color-warning;

                .el-alert__description {
                    color: $--color-warning;
                }
            }

            &.is-dark {
                background-color: $--color-warning;
                color: $--color-white;
            }
        }

        @include m(error) {
            &.is-light {
                background-color: $--alert-danger-color;
                color: $--color-danger;

                .el-alert__description {
                    color: $--color-danger;
                }
            }

            &.is-dark {
                background-color: $--color-danger;
                color: $--color-white;
            }
        }

        @include e(content) {
            display: table-cell;
            padding: 0 8px;
        }

        @include e(icon) {
            font-size: $--alert-icon-size;
            width: $--alert-icon-size;
            @include when(big) {
                font-size: $--alert-icon-large-size;
                width: $--alert-icon-large-size;
            }
        }

        @include e(title) {
            font-size: $--alert-title-font-size;
            line-height: 18px;
            @include when(bold) {
                font-weight: bold;
            }
        }

        & .el-alert__description {
            font-size: $--alert-description-font-size;
            margin: 5px 0 0 0;
        }

        @include e(closebtn) {
            font-size: $--alert-close-font-size;
            opacity: 1;
            position: absolute;
            top: 12px;
            right: 15px;
            cursor: pointer;

            @include when(customed) {
                font-style: normal;
                font-size: $--alert-close-customed-font-size;
                top: 9px;
            }
        }
    }

    .el-alert-fade-enter,
    .el-alert-fade-leave-active {
        opacity: 0;
    }

</style>
