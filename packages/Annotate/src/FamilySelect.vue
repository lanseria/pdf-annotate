<template>
  <n-popselect
    :value="value"
    :options="options"
    trigger="click"
    @update:value="handleUpdate"
  >
    <n-button size="small">
      <template #icon>
        <n-icon>
          <TextOutlineIcon />
        </n-icon>
      </template>
      {{ value }}
    </n-button>
  </n-popselect>
</template>
<script lang="ts">
import { NButton, NIcon, NPopselect } from "naive-ui";
import { TextOutline as TextOutlineIcon } from "@vicons/ionicons5";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    NButton,
    NIcon,
    NPopselect,

    TextOutlineIcon
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const handleUpdate = (val: string) => {
      emit("update:value", val);
    };
    return {
      options: [
        {
          label: "微软雅黑",
          value: "微软雅黑"
        },
        {
          label: "宋体",
          value: "宋体"
        },
        {
          label: "Arial",
          value: "Arial"
        },
        {
          label: "Time News Roman",
          value: "Time News Roman"
        }
      ],
      handleUpdate
    };
  }
});
</script>
