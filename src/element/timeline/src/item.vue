<template>
  <li class="el-timeline-item">
    <div class="el-timeline-item__tail"></div>

    <div v-if="!$slots.dot"
      class="el-timeline-item__node"
      :class="[
        `el-timeline-item__node--${size || ''}`,
        `el-timeline-item__node--${type || ''}`
      ]"
      :style="{
        backgroundColor: color
      }"
    >
      <i v-if="icon"
        class="el-timeline-item__icon"
        :class="icon"
      ></i>
    </div>
    <div v-if="$slots.dot" class="el-timeline-item__dot">
      <slot name="dot"></slot>
    </div>

    <div class="el-timeline-item__wrapper">
      <div v-if="!hideTimestamp && placement === 'top'"
        class="el-timeline-item__timestamp is-top">
        {{timestamp}}
      </div>

      <div class="el-timeline-item__content">
        <slot></slot>
      </div>

      <div v-if="!hideTimestamp && placement === 'bottom'"
        class="el-timeline-item__timestamp is-bottom">
        {{timestamp}}
      </div>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'ElTimelineItem',

    inject: ['timeline'],

    props: {
      timestamp: String,

      hideTimestamp: {
        type: Boolean,
        default: false
      },

      placement: {
        type: String,
        default: 'bottom'
      },

      type: String,

      color: String,

      size: {
        type: String,
        default: 'normal'
      },

      icon: String
    }
  };
</script>
<style lang="scss">
    @import "../../mixins/mixins";
    @import "../../common/var";

    @include b(timeline-item) {
        position: relative;
        padding-bottom: 20px;

        @include e(wrapper) {
            position: relative;
            padding-left: 28px;
            top: -3px;
        }

        @include e(tail) {
            position: absolute;
            left: 4px;
            height: 100%;
            border-left: 2px solid $--timeline-node-color;
        }

        @include e(icon) {
            color: $--color-white;
            font-size: $--font-size-small;
        }

        @include e(node) {
            position: absolute;
            background-color: $--timeline-node-color;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            @include m(normal) {
                left: -1px;
                width: $--timeline-node-size-normal;
                height: $--timeline-node-size-normal;
            }
            @include m(large) {
                left: -2px;
                width: $--timeline-node-size-large;
                height: $--timeline-node-size-large;
            }

            @include m(primary) {
                background-color: $--color-primary;
            }
            @include m(success) {
                background-color: $--color-success;
            }
            @include m(warning) {
                background-color: $--color-warning;
            }
            @include m(danger) {
                background-color: $--color-danger;
            }
            @include m(info) {
                background-color: $--color-info;
            }
        }

        @include e(dot) {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @include e(content) {
            color: $--color-text-primary;
        }

        @include e(timestamp) {
            color: $--color-text-secondary;
            line-height: 1;
            font-size: $--font-size-small;

            @include when(top) {
                margin-bottom: 8px;
                padding-top: 4px;
            }
            @include when(bottom) {
                margin-top: 8px;
            }
        }
    }

</style>
