<template>
  <canvas
    ref="CanvasRef"
    class="canvas"
    :width="width"
    :height="height"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseout="handleMouseOut"
    @mousemove="handleMouseMove"
  ></canvas>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  // watch,
  Ref,
} from "vue";
// import { useMouseInElement, useMousePressed } from "@vueuse/core";
const Paint = defineComponent({
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    let pressed = false;
    const paintState = inject<Ref<PaintState>>("paintState")!;
    const state = reactive({
      ctx: null as CanvasRenderingContext2D | null,
      CanvasRef: {} as HTMLCanvasElement,
    });
    const save = () => {
      return state.CanvasRef.toDataURL("image/png");
    };
    const handleMouseDown = (e: MouseEvent) => {
      pressed = true;
    };
    const handleMouseUp = (e: MouseEvent) => {
      pressed = false;
    };
    const handleMouseOut = (e: MouseEvent) => {
      pressed = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (state.ctx) {
        if (pressed) {
          const x = e.offsetX;
          const y = e.offsetY;
          state.ctx.lineTo(x, y);
          state.ctx.lineWidth = paintState.value.size * 2;
          state.ctx.lineCap = "round";
          state.ctx.lineJoin = "round";
          state.ctx.strokeStyle = paintState.value.color;
          state.ctx.fillStyle = paintState.value.color;
          state.ctx.stroke();
          state.ctx.beginPath();
          state.ctx.arc(x, y, paintState.value.size, 0, 2 * Math.PI, true);
          state.ctx.fill();
          state.ctx.beginPath();
          state.ctx.moveTo(x, y);
        } else {
          state.ctx.beginPath();
        }
      }
    };
    onMounted(() => {
      state.ctx = state.CanvasRef.getContext("2d");
    });
    return {
      ...toRefs(state),
      // method
      save,
      handleMouseDown,
      handleMouseUp,
      handleMouseOut,
      handleMouseMove,
    };
  },
});
export default Paint;
export type PaintRefs = InstanceType<typeof Paint>;
</script>

<style scoped>
.canvas {
  position: absolute;
  z-index: 1;
}
</style>
