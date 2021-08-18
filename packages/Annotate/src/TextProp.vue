<template>
  <n-space class="property">
    <ColorSelect
      :value="textState.color"
      @update:value="handleUpdateColor"
    ></ColorSelect>
    <n-popover trigger="click" :width="200" placement="bottom">
      <template #trigger>
        <n-button size="small">
          <template #icon>
            <n-icon>
              <PencilSharpIcon />
            </n-icon>
          </template>
          {{ textState.size }}px
        </n-button>
      </template>
      <n-slider
        :value="textState.size"
        :step="1"
        :max="32"
        :min="12"
        :format-tooltip="value => `${value}px`"
        @update:value="handleUpdateSize"
      />
    </n-popover>
    <FamilySelect
      :value="textState.family"
      @update:value="handleUpdateFamily"
    ></FamilySelect>
  </n-space>
</template>
<script lang="ts">
import { NButton, NIcon, NSpace, NPopover, NSlider } from "naive-ui";
import { PencilSharp as PencilSharpIcon } from "@vicons/ionicons5";
import ColorSelect from "./ColorSelect.vue";
import FamilySelect from "./FamilySelect.vue";
import { defineComponent, PropType } from "vue";
export default defineComponent({
  components: {
    NButton,
    NSpace,
    NIcon,
    NPopover,
    NSlider,

    PencilSharpIcon,

    ColorSelect,
    FamilySelect
  },
  emits: ["update:textState"],
  props: {
    textState: {
      type: Object as PropType<TextState>,
      required: true
    }
  },
  setup(props, { emit }) {
    const handleUpdateSize = (v: number) => {
      emit("update:textState", {
        ...props.textState,
        size: v
      });
    };
    const handleUpdateColor = (v: string) => {
      emit("update:textState", { ...props.textState, color: v });
    };
    const handleUpdateFamily = (v: string) => {
      emit("update:textState", {
        ...props.textState,
        family: v
      });
    };
    return {
      handleUpdateSize,
      handleUpdateColor,
      handleUpdateFamily
    };
  }
});
</script>
