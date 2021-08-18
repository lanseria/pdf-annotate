<template>
  <n-space class="property">
    <ColorSelect
      :value="paintState.color"
      @update:value="handleUpdateColor"
    ></ColorSelect>

    <n-popover trigger="click" :width="200" placement="bottom">
      <template #trigger>
        <n-button size="small">
          <template #icon>
            <n-icon>
              <BrushOutlineIcon />
            </n-icon>
          </template>
          {{ paintState.size }}px
        </n-button>
      </template>
      <n-slider
        v-model:value="sizeValue"
        :step="1"
        :max="32"
        :min="1"
        :format-tooltip="(value) => `${value}px`"
        @update:value="handleUpdateSize"
      />
    </n-popover>
  </n-space>
</template>
<script lang="ts">
import { NButton, NIcon, NSpace, NPopover, NSlider } from "naive-ui";
import { BrushOutline as BrushOutlineIcon } from "@vicons/ionicons5";
import ColorSelect from "./ColorSelect.vue";
import { defineComponent, ref, PropType } from "vue";
export default defineComponent({
  components: {
    NButton,
    NSpace,
    NIcon,
    NPopover,
    NSlider,

    BrushOutlineIcon,

    ColorSelect,
  },
  emits: ["update:paintState"],
  props: {
    paintState: {
      type: Object as PropType<PaintState>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const sizeValue = ref(props.paintState.size);
    const handleUpdateSize = (v: number) => {
      emit("update:paintState", {
        size: v,
        color: props.paintState.color,
      });
    };
    const handleUpdateColor = (v: string) => {
      emit("update:paintState", {
        color: v,
        size: props.paintState.size,
      });
    };
    return {
      sizeValue,
      handleUpdateSize,
      handleUpdateColor,
    };
  },
});
</script>
