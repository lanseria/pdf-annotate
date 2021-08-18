<template>
  <div
    class="textarea-wrap"
    :style="{
      top: item.y + 'px',
      left: item.x + 'px'
    }"
  >
    <textarea
      class="textarea"
      :style="{ fontSize: textState.size + 'px', fontFamily: textState.family }"
      ref="TextareaRef"
      v-model="state.text"
    >
    </textarea>
    <n-button
      class="close-icon"
      type="primary"
      text
      style="font-size: 24px"
      @click.stop="handleDel()"
    >
      <n-icon>
        <CloseCircleIcon />
      </n-icon>
    </n-button>
    <n-button
      class="check-icon"
      type="primary"
      text
      style="font-size: 24px"
      @click.stop="handleInsert()"
    >
      <n-icon>
        <CheckmarkCircleOutlineIcon />
      </n-icon>
    </n-button>
  </div>
</template>
<script lang="ts">
import { NIcon, useThemeVars, NButton } from "naive-ui";
import {
  CloseCircle as CloseCircleIcon,
  CheckmarkCircleOutline as CheckmarkCircleOutlineIcon
} from "@vicons/ionicons5";
import {
  defineComponent,
  onMounted,
  ref,
  PropType,
  watchPostEffect,
  inject,
  Ref
} from "vue";
export default defineComponent({
  emits: ["update-text-list", "on-del", "on-insert"],
  props: {
    item: {
      type: Object as PropType<TextAreaItemVO>,
      required: true
    }
  },
  components: {
    NIcon,
    NButton,
    CloseCircleIcon,
    CheckmarkCircleOutlineIcon
  },
  setup(props, { emit }) {
    const textState = inject<Ref<TextState>>("textState")!;
    const themeVars = useThemeVars();
    const TextareaRef = ref<HTMLElement>();
    const state = ref({
      x: props.item.x,
      y: props.item.y,
      text: ""
    });
    const handleDel = () => {
      emit("on-del");
    };
    const handleInsert = () => {
      emit("on-insert");
    };
    onMounted(() => {
      setTimeout(() => {
        TextareaRef.value?.focus();
      }, 500);
    });
    watchPostEffect(() => {
      emit("update-text-list", state.value.text);
    });
    return {
      textState,
      state,
      themeVars,
      TextareaRef,
      handleDel,
      handleInsert
    };
  }
});
</script>
<style scoped>
.textarea-wrap {
  position: absolute;
  z-index: 1;
}
.close-icon {
  position: absolute;
  top: -24px;
  left: calc(50% + 2px);
}
.check-icon {
  position: absolute;
  top: -24px;
  left: calc(50% - 26px);
}
.textarea {
  padding: 1px;
  margin: 0;
  border: 1px dashed;
  border-radius: 0;
  outline: none;
  resize: none;
  overflow: hidden;
  width: 250px;
  height: 70px;
  background-color: #0000000f;
}
</style>
