<template>
  <div
    :class="carouselClasses"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave">
    <div
      class="el-carousel__container"
      :style="{ height: height }">
      <transition
        v-if="arrowDisplay"
        name="carousel-arrow-left">
        <button
          type="button"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex - 1)"
          class="el-carousel__arrow el-carousel__arrow--left">
          <i class="el-icon-arrow-left"></i>
        </button>
      </transition>
      <transition
        v-if="arrowDisplay"
        name="carousel-arrow-right">
        <button
          type="button"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex < items.length - 1)"
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex + 1)"
          class="el-carousel__arrow el-carousel__arrow--right">
          <i class="el-icon-arrow-right"></i>
        </button>
      </transition>
      <slot></slot>
    </div>
    <ul
      v-if="indicatorPosition !== 'none'"
      :class="indicatorsClasses">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'el-carousel__indicator',
          'el-carousel__indicator--' + direction,
          { 'is-active': index === activeIndex }]"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)">
        <button class="el-carousel__button">
          <span v-if="hasLabel">{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import throttle from 'throttle-debounce/throttle';
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';

export default {
  name: 'ElCarousel',

  props: {
    initialIndex: {
      type: Number,
      default: 0
    },
    height: String,
    trigger: {
      type: String,
      default: 'hover'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    indicatorPosition: String,
    indicator: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: String,
      default: 'hover'
    },
    type: String,
    loop: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      }
    }
  },

  data() {
    return {
      items: [],
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false
    };
  },

  computed: {
    arrowDisplay() {
      return this.arrow !== 'never' && this.direction !== 'vertical';
    },

    hasLabel() {
      return this.items.some(item => item.label.toString().length > 0);
    },

    carouselClasses() {
      const classes = ['el-carousel', 'el-carousel--' + this.direction];
      if (this.type === 'card') {
        classes.push('el-carousel--card');
      }
      return classes;
    },

    indicatorsClasses() {
      const classes = ['el-carousel__indicators', 'el-carousel__indicators--' + this.direction];
      if (this.hasLabel) {
        classes.push('el-carousel__indicators--labels');
      }
      if (this.indicatorPosition === 'outside' || this.type === 'card') {
        classes.push('el-carousel__indicators--outside');
      }
      return classes;
    }
  },

  watch: {
    items(val) {
      if (val.length > 0) this.setActiveItem(this.initialIndex);
    },

    activeIndex(val, oldVal) {
      this.resetItemPosition(oldVal);
      this.$emit('change', val, oldVal);
    },

    autoplay(val) {
      val ? this.startTimer() : this.pauseTimer();
    },

    loop() {
      this.setActiveItem(this.activeIndex);
    }
  },

  methods: {
    handleMouseEnter() {
      this.hover = true;
      this.pauseTimer();
    },

    handleMouseLeave() {
      this.hover = false;
      this.startTimer();
    },

    itemInStage(item, index) {
      const length = this.items.length;
      if (index === length - 1 && item.inStage && this.items[0].active ||
        (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
        return 'left';
      } else if (index === 0 && item.inStage && this.items[length - 1].active ||
        (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
        return 'right';
      }
      return false;
    },

    handleButtonEnter(arrow) {
      if (this.direction === 'vertical') return;
      this.items.forEach((item, index) => {
        if (arrow === this.itemInStage(item, index)) {
          item.hover = true;
        }
      });
    },

    handleButtonLeave() {
      if (this.direction === 'vertical') return;
      this.items.forEach(item => {
        item.hover = false;
      });
    },

    updateItems() {
      this.items = this.$children.filter(child => child.$options.name === 'ElCarouselItem');
    },

    resetItemPosition(oldIndex) {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex, oldIndex);
      });
    },

    playSlides() {
      if (this.activeIndex < this.items.length - 1) {
        this.activeIndex++;
      } else if (this.loop) {
        this.activeIndex = 0;
      }
    },

    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    startTimer() {
      if (this.interval <= 0 || !this.autoplay || this.timer) return;
      this.timer = setInterval(this.playSlides, this.interval);
    },

    setActiveItem(index) {
      if (typeof index === 'string') {
        const filteredItems = this.items.filter(item => item.name === index);
        if (filteredItems.length > 0) {
          index = this.items.indexOf(filteredItems[0]);
        }
      }
      index = Number(index);
      if (isNaN(index) || index !== Math.floor(index)) {
        console.warn('[Element Warn][Carousel]index must be an integer.');
        return;
      }
      let length = this.items.length;
      const oldIndex = this.activeIndex;
      if (index < 0) {
        this.activeIndex = this.loop ? length - 1 : 0;
      } else if (index >= length) {
        this.activeIndex = this.loop ? 0 : length - 1;
      } else {
        this.activeIndex = index;
      }
      if (oldIndex === this.activeIndex) {
        this.resetItemPosition(oldIndex);
      }
    },

    prev() {
      this.setActiveItem(this.activeIndex - 1);
    },

    next() {
      this.setActiveItem(this.activeIndex + 1);
    },

    handleIndicatorClick(index) {
      this.activeIndex = index;
    },

    handleIndicatorHover(index) {
      if (this.trigger === 'hover' && index !== this.activeIndex) {
        this.activeIndex = index;
      }
    }
  },

  created() {
    this.throttledArrowClick = throttle(300, true, index => {
      this.setActiveItem(index);
    });
    this.throttledIndicatorHover = throttle(300, index => {
      this.handleIndicatorHover(index);
    });
  },

  mounted() {
    this.updateItems();
    this.$nextTick(() => {
      addResizeListener(this.$el, this.resetItemPosition);
      if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex;
      }
      this.startTimer();
    });
  },

  beforeDestroy() {
    if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    this.pauseTimer();
  }
};
</script>
<style lang="scss">
    @import "../../mixins/mixins";
    @import "../../common/var";

    @include b(carousel) {
        position: relative;

        @include m(horizontal) {
            overflow-x: hidden;
        }

        @include m(vertical) {
            overflow-y: hidden;
        }

        @include e(container) {
            position: relative;
            height: 300px;
        }

        @include e(arrow) {
            border: none;
            outline: none;
            padding: 0;
            margin: 0;
            height: $--carousel-arrow-size;
            width: $--carousel-arrow-size;
            cursor: pointer;
            transition: .3s;
            border-radius: 50%;
            background-color: $--carousel-arrow-background;
            color: $--color-white;
            position: absolute;
            top: 50%;
            z-index: 10;
            transform: translateY(-50%);
            text-align: center;
            font-size: $--carousel-arrow-font-size;

            @include m(left) {
                left: 16px;
            }

            @include m(right) {
                right: 16px;
            }

            &:hover {
                background-color: $--carousel-arrow-hover-background;
            }

            & i {
                cursor: pointer;
            }
        }

        @include e(indicators) {
            position: absolute;
            list-style: none;
            margin: 0;
            padding: 0;
            z-index: #{$--index-normal + 1};

            @include m(horizontal) {
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }

            @include m(vertical) {
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }

            @include m(outside) {
                bottom: #{$--carousel-indicator-height + $--carousel-indicator-padding-vertical * 2};
                text-align: center;
                position: static;
                transform: none;
                .el-carousel__indicator:hover button {
                    opacity: 0.64;
                }
                button {
                    background-color: $--carousel-indicator-out-color;
                    opacity: 0.24;
                }
            }

            @include m(labels) {
                left: 0;
                right: 0;
                transform: none;
                text-align: center;

                .el-carousel__button {
                    height: auto;
                    width: auto;
                    padding: 2px 18px;
                    font-size: 12px;
                }

                .el-carousel__indicator {
                    padding: 6px 4px;
                }
            }
        }

        @include e(indicator) {
            background-color: transparent;
            cursor: pointer;

            &:hover button {
                opacity: 0.72;
            }

            @include m(horizontal) {
                display: inline-block;
                padding: $--carousel-indicator-padding-vertical $--carousel-indicator-padding-horizontal;
            }

            @include m(vertical) {
                padding: $--carousel-indicator-padding-horizontal $--carousel-indicator-padding-vertical;
                .el-carousel__button {
                    width: $--carousel-indicator-height;
                    height: #{$--carousel-indicator-width / 2};
                }
            }

            @include when(active) {
                button {
                    opacity: 1;
                }
            }
        }

        @include e(button) {
            display: block;
            opacity: 0.48;
            width: $--carousel-indicator-width;
            height: $--carousel-indicator-height;
            background-color: $--color-white;
            border: none;
            outline: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            transition: .3s;
        }
    }

    .carousel-arrow-left-enter,
    .carousel-arrow-left-leave-active {
        transform: translateY(-50%) translateX(-10px);
        opacity: 0;
    }

    .carousel-arrow-right-enter,
    .carousel-arrow-right-leave-active {
        transform: translateY(-50%) translateX(10px);
        opacity: 0;
    }

</style>
