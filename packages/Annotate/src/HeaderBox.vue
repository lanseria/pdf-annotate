<template>
  <div class="header-box">
    <div class="title">
      {{ name }}
      &nbsp;
      <n-switch :value="theme === null" @update:value="handleUpdate">
        <template #checked>深色</template>
        <template #unchecked>浅色</template>
      </n-switch>
    </div>
    <div class="tabs">
      <n-tag checkable :checked="!isAnnotate" @click="handleView()">
        阅读模式
      </n-tag>
      <n-tag checkable :checked="isAnnotate" @click="handleAnnotate()">
        批注模式
      </n-tag>
    </div>
    <div class="viewer-tools">
      <n-space>
        <n-pagination
          :page="current"
          :page-count="total"
          :page-slot="5"
          @update:page="handlePage"
        />
        <n-button size="small" ghost @click="handleFullscreen()">
          <template #icon>
            <n-icon>
              <ExpandIcon />
            </n-icon>
          </template>
        </n-button>
        <n-button size="small" ghost> 关闭 </n-button>
      </n-space>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  NButton,
  NPagination,
  NTag,
  NIcon,
  NSpace,
  NSwitch,
  darkTheme,
} from "naive-ui";
import { Expand as ExpandIcon } from "@vicons/ionicons5";
export default defineComponent({
  props: {
    name: {
      type: String,
      default: "",
    },
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
    isAnnotate: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: [Object, null] as PropType<any>,
      required: true,
    },
  },
  emits: ["update:isAnnotate", "on-page", "on-fullscreen", "update:theme"],
  components: {
    NButton,
    NPagination,
    NTag,
    NIcon,
    NSpace,
    NSwitch,

    ExpandIcon,
  },
  setup(props, { emit }) {
    // method
    const handleView = () => {
      emit("update:isAnnotate", false);
    };
    const handleAnnotate = () => {
      emit("update:isAnnotate", true);
    };
    const handlePage = (payload: number) => {
      emit("on-page", payload);
    };
    const handleFullscreen = () => {
      emit("on-fullscreen");
    };
    const handleUpdate = (v: boolean) => {
      if (v) {
        emit("update:theme", null);
      } else {
        emit("update:theme", darkTheme);
      }
    };
    return {
      handleView,
      handleAnnotate,
      handlePage,
      handleFullscreen,
      handleUpdate,
    };
  },
});
</script>
<style lang="css" scoped>
.header-box {
  background-color: var(--color-modal);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 20px;
}
.title {
  display: flex;
  align-items: center;
}
.tabs {
  display: flex;
}

.viewer-tools {
  display: flex;
  align-items: center;
}
</style>
