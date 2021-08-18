<template>
  <div v-if="isAnnotate" class="tools-box">
    <n-space class="select">
      <n-button
        size="small"
        :type="editState === 'Paint' ? 'primary' : 'default'"
        @click="handlePaint()"
        ghost
      >
        <template #icon>
          <n-icon>
            <BrushSharpIcon />
          </n-icon>
        </template>
      </n-button>
      <n-button
        size="small"
        :type="editState === 'Text' ? 'primary' : 'default'"
        @click="handleText()"
        ghost
      >
        <template #icon>
          <n-icon>
            <TextIcon />
          </n-icon>
        </template>
      </n-button>
    </n-space>
    <PaintProp
      v-if="editState === 'Paint'"
      :paintState="paintState"
      @update:paintState="handleUpdatePaintState"
    ></PaintProp>
    <TextProp
      v-if="editState === 'Text'"
      :textState="textState"
      @update:textState="handleUpdateTextState"
    ></TextProp>
    <n-space class="operate">
      <n-input
        v-model:value="remarks"
        size="small"
        type="text"
        placeholder="备注"
      />
      <n-button size="small" type="primary" @click="handleSave()" ghost>
        <template #icon>
          <n-icon>
            <SaveOutlineIcon />
          </n-icon>
        </template>
      </n-button>
    </n-space>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { NIcon, NSpace, NButton, NInput } from "naive-ui";
import {
  BrushSharp as BrushSharpIcon,
  Text as TextIcon,
  SaveOutline as SaveOutlineIcon,
} from "@vicons/ionicons5";
import PaintProp from "./PaintProp.vue";
import TextProp from "./TextProp.vue";
export default defineComponent({
  props: {
    isAnnotate: {
      type: Boolean,
      required: true,
    },
    editState: {
      type: String,
      required: true,
    },
    paintState: {
      type: Object as PropType<PaintState>,
      required: true,
    },
    textState: {
      type: Object as PropType<TextState>,
      required: true,
    },
  },
  components: {
    NIcon,
    NSpace,
    NButton,
    NInput,

    BrushSharpIcon,
    TextIcon,
    SaveOutlineIcon,

    PaintProp,
    TextProp,
  },
  emits: [
    "on-save",
    "update:editState",
    "update:paintState",
    "update:textState",
  ],
  setup(props, { emit }) {
    const remarks = ref("备注1");
    const handleSave = () => {
      emit("on-save", remarks.value);
      remarks.value = "";
    };
    const handleText = () => {
      emit("update:editState", "Text");
    };
    const handlePaint = () => {
      emit("update:editState", "Paint");
    };
    const handleUpdatePaintState = (v: PaintState) => {
      emit("update:paintState", v);
    };
    const handleUpdateTextState = (v: PaintState) => {
      emit("update:textState", v);
    };
    return {
      remarks,
      handleSave,
      handleText,
      handlePaint,
      handleUpdatePaintState,
      handleUpdateTextState,
    };
  },
});
</script>
<style lang="css" scoped>
.tools-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-modal);
  align-items: center;
  height: 50px;
  padding: 0 20px;
}
.icon-btn {
  border-radius: 5px;
  background-color: #aaa;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.canvas-btn {
  width: 40px;
}

.down-icon {
  margin-left: 5px;
  display: none;
}

.icon-btn:hover {
  background-color: #999;
}
.icon-btn.active {
  background-color: var(--color-target);
  cursor: default;
}
.icon-btn.active .down-icon {
  display: inline;
  cursor: pointer;
}
</style>
