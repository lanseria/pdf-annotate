<template>
  <div
    class="text-div"
    :style="{ width: `${width}px`, height: `${height}px` }"
    @click="handleStartText"
  >
    <TextArea
      v-for="(item, i) in textAreaList"
      :key="item.id"
      :item="item"
      @update-text-list="updateTextList(i, $event)"
      @on-del="handleDel(item.id)"
      @on-insert="handleInsert()"
    ></TextArea>
    <canvas ref="TextRef" class="text" :width="width" :height="height">
    </canvas>
  </div>
</template>
<script lang="ts">
import { nanoid } from "nanoid";
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  watch,
  Ref
} from "vue";
import TextArea from "./TextArea.vue";
const Text = defineComponent({
  components: {
    TextArea
  },
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const textState = inject<Ref<TextState>>("textState")!;
    const POINTER_HEIGHT = 4;
    const state = reactive({
      TextRef: {} as HTMLCanvasElement,
      ctx: null as CanvasRenderingContext2D | null,
      isSearhing: true,
      textAreaList: [] as TextAreaItemVO[]
    });
    // computed
    const textCursor = computed(() => {
      if (state.isSearhing) {
        return "text";
      } else {
        return "auto";
      }
    });
    // method
    const updateTextList = (i: number, text: string) => {
      state.textAreaList[i].text = text;
    };
    const drawTextBoxAndSave = () => {
      // return state.TextRef.toDataURL("image/png");
      return state.TextRef;
    };
    const handleDel = (id: string) => {
      state.textAreaList = state.textAreaList.filter(m => m.id !== id);
      state.isSearhing = true;
    };
    const handleStartText = (e: MouseEvent) => {
      if (state.isSearhing && props.enabled) {
        state.isSearhing = false;
        state.textAreaList.push({
          id: nanoid(),
          x: e.offsetX,
          // -POINTER_HEIGHT为插入中间值
          y: e.offsetY - POINTER_HEIGHT,
          text: ""
        });
      }
    };
    const handleInsert = () => {
      state.textAreaList.map(m => {
        if (state.ctx) {
          state.ctx.fillStyle = textState.value.color;
          state.ctx.font = `${textState.value.size}px ${textState.value.family}`;
          // +POINTER_HEIGHT为插入中间值
          state.ctx.fillText(
            m.text,
            m.x,
            m.y + POINTER_HEIGHT + textState.value.size
          );
        }
      });
      state.textAreaList = [];
      state.isSearhing = true;
    };
    // hooks
    onMounted(() => {
      state.ctx = state.TextRef.getContext("2d");
      watch(
        () => props.enabled,
        (nVal, oVal) => {
          if (!nVal && oVal) {
            // 切换为其他模式
            state.textAreaList = [];
            state.isSearhing = true;
          }
        }
      );
    });
    return {
      ...toRefs(state),
      // computed
      textCursor,
      // method
      updateTextList,
      drawTextBoxAndSave,
      handleDel,
      handleInsert,
      handleStartText
    };
  }
});
export default Text;
export type TextRefs = InstanceType<typeof Text>;
</script>
<style scoped>
.text,
.text-div {
  position: absolute;
  /* cursor: v-bind(textCursor); */
}
</style>
