<template>
  <n-popselect
    :value="value"
    :options="options"
    trigger="click"
    @update:value="handleUpdate"
  >
    <n-button size="small" :color="value">
      <template #icon>
        <n-icon>
          <RadioButtonOnIcon />
        </n-icon>
      </template>
      {{ value }}
    </n-button>
  </n-popselect>
</template>
<script lang="ts">
import { NButton, NIcon, NPopselect } from "naive-ui";
import { RadioButtonOn as RadioButtonOnIcon } from "@vicons/ionicons5";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    NButton,
    NIcon,
    NPopselect,

    RadioButtonOnIcon
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
          label: "黑色",
          value: "#000"
        },
        {
          label: "红色",
          value: "#ff0000"
        },
        {
          label: "绿色",
          value: "#4caf50"
        },
        {
          label: "黄色",
          value: "#ffeb3b"
        },
        {
          label: "蓝色",
          value: "#03a9f4"
        },
        {
          label: "橘色",
          value: "#ff5722"
        },
        {
          label: "灰蓝",
          value: "#607d8b"
        },
        {
          label: "紫色",
          value: "#673ab7"
        },
        {
          label: "棕色",
          value: "#795548"
        }
      ],
      handleUpdate
    };
  }
});
</script>
