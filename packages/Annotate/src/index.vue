<template>
  <n-config-provider style="height: 100%" :theme="theme">
    <n-layout class="pdf-annotate" ref="PdfAnnotateRef">
      <div class="header-tab">
        <HeaderBox
          name="PDF"
          :current="current"
          :total="total"
          :isAnnotate="isAnnotate"
          :theme="theme"
          @update:isAnnotate="(v) => (isAnnotate = v)"
          @update:theme="(v) => (theme = v)"
          @on-page="handlePage"
          @on-fullscreen="fullscreen()"
        ></HeaderBox>
        <ToolsBox
          :isAnnotate="isAnnotate"
          :editState="editState"
          :paintState="paintState"
          :textState="textState"
          @on-save="handleSave"
          @update:editState="(v) => (editState = v)"
          @update:paintState="(v) => (paintState = v)"
          @update:textState="(v) => (textState = v)"
        ></ToolsBox>
      </div>
      <n-layout-content class="viewer-wrap">
        <div class="render-content" ref="RenderContentRef">
          <template v-if="isAnnotate && editState !== ''">
            <Paint
              ref="PaintRef"
              :width="CanvasRef.width"
              :height="CanvasRef.height"
              :enabled="editState === 'Paint'"
              :style="{ zIndex: editState === 'Paint' ? 1 : 0 }"
            ></Paint>
            <Text
              ref="TextRef"
              :width="CanvasRef.width"
              :height="CanvasRef.height"
              :enabled="editState === 'Text'"
              :style="{ zIndex: editState === 'Text' ? 1 : 0 }"
            ></Text>
          </template>
          <!-- <img
              v-for="item in showAnnotate ? annotateList : []"
              :key="item.relationId"
              style="position: absolute"
              :width="CanvasRef.width"
              :height="CanvasRef.height"
              :src="item.content"
              :alt="item.remarks"
            /> -->
          <canvas ref="CanvasRef" class="pdf-canvas"></canvas>
        </div>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
<script lang="ts">
import { NLayout, NLayoutContent, NConfigProvider } from "naive-ui";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  ref,
  watchEffect,
  provide,
} from "vue";
import * as pdfjsLib from "pdfjs-dist";
import {
  PDFDocumentProxy,
  PDFPageProxy,
  TypedArray,
} from "pdfjs-dist/types/display/api";
import HeaderBox from "./HeaderBox.vue";
import ToolsBox from "./ToolsBox.vue";
import Paint, { PaintRefs } from "./Paint.vue";
import Text, { TextRefs } from "./Text.vue";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.zhimg.com/pdfjs-dist@2.9.359/build/pdf.worker.min.js";
type EditState = "" | "Paint" | "Text";

export default defineComponent({
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  emits: ["update-state", "get-annotate", "create-annotate"],
  components: {
    NLayout,
    NLayoutContent,
    NConfigProvider,

    HeaderBox,
    ToolsBox,
    Paint,
    Text,
  },
  setup(props, { emit }) {
    const state = reactive({
      CanvasRef: {} as HTMLCanvasElement,
      PaintRef: {} as PaintRefs,
      TextRef: {} as TextRefs,
      RenderContentRef: {} as HTMLElement,
      PdfAnnotateRef: {} as HTMLElement,
      loading: false,
      isAnnotate: false,
      current: 1,
      total: 0,
      editState: "" as EditState,
      pdfDoc: {} as PDFDocumentProxy,
      pdfPage: {} as PDFPageProxy,
      info: {
        title: "",
        author: "",
        subject: "",
        keywords: "",
      },
    });
    const paintState = ref<PaintState>({
      size: 3,
      color: "#000",
    });
    const textState = ref<TextState>({
      size: 14,
      color: "#000",
      family: "微软雅黑",
    });
    provide("paintState", paintState);
    provide("textState", textState);
    // method
    /**
     * @description: 检测有没有元素处于全屏状态
     * @return 布尔值
     */
    const isElementFullScreen = () => {
      const fullscreenElement = document.fullscreenElement;
      if (fullscreenElement === null) {
        return false; // 当前没有元素在全屏状态
      } else {
        return true; // 有元素在全屏状态
      }
    };
    const fullscreen = () => {
      if (isElementFullScreen()) {
        document.exitFullscreen();
      } else {
        state.PdfAnnotateRef.requestFullscreen();
      }
    };
    const handleSave = (remarks: string) => {
      const PaintCanvas: HTMLCanvasElement = state.PaintRef.$el;
      const paintContext = PaintCanvas.getContext("2d");
      if (paintContext) {
        const textCanvas = state.TextRef.drawTextBoxAndSave();
        // 混合两幅 canvas 图像
        paintContext.globalCompositeOperation = "lighter";
        paintContext.drawImage(textCanvas, 0, 0);
        // paintContext.putImageData(textCanvasImageData, 0, 0);
        PaintCanvas.toBlob((blob) => {
          const formData = new FormData();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          blob && formData.append("file", blob, "1.png");
          // const img = window.URL.createObjectURL(blob);
          // console.log(img);
          // save pdf
        });
      }
    };

    const getBufferArray = async (src: string) => {
      return (await fetch(src).then((res) => res.arrayBuffer())) as TypedArray;
    };
    const render = async () => {
      // Display page on the existing canvas with 100% scale.
      const viewport = state.pdfPage.getViewport({ scale: 1 });
      state.CanvasRef.width = viewport.width;
      state.CanvasRef.height = viewport.height;
      const ctx = state.CanvasRef.getContext("2d");
      if (!ctx) {
        return;
      }
      const renderTask = state.pdfPage.render({
        canvasContext: ctx,
        viewport,
      });
      await renderTask.promise;
      // emit to parent
      emit("update-state", {
        current: state.current,
        total: state.total,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      });
    };
    const getPdfPage = async (crt: number) => {
      state.loading = true;
      if (!state.pdfDoc) {
        return;
      }
      state.pdfPage = await state.pdfDoc.getPage(crt);
      await render();
      state.loading = false;
      state.RenderContentRef.scrollTo({
        top: 0,
      });
    };
    const handleRefreshPage = async () => {
      await getPdfPage(state.current);
      emit("get-annotate", state.current);
    };
    const handlePage = async (page: number) => {
      await getPdfPage(page);
      state.current = page;
      emit("get-annotate", state.current);
    };
    const refreshPdfDoc = async (buf: TypedArray) => {
      state.pdfDoc = await pdfjsLib.getDocument(buf as TypedArray).promise;
      state.total = state.pdfDoc.numPages;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { info }: { info: any } = await state.pdfDoc.getMetadata();
      state.info = {
        title: info.Title,
        author: info.Author,
        subject: info.Subject,
        keywords: info.Keywords,
      };
      getPdfPage(state.current);
    };
    const getPdfDoc = async () => {
      if (props.src) {
        await refreshPdfDoc(await getBufferArray(props.src));
        emit("get-annotate", state.current);
      }
    };
    onMounted(() => {
      getPdfDoc();
      watchEffect(() => {
        if (state.isAnnotate === false) {
          state.editState = "";
        }
      });
    });
    return {
      theme: ref(null),
      paintState,
      textState,
      fullscreen,
      handleSave,
      handlePage,
      ...toRefs(state),
    };
  },
});
</script>
<style lang="css" scoped>
.pdf-annotate {
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow);
  height: 100%;
}
.header-tab {
  display: flex;
  flex: 0 1 0;
  flex-direction: column;
  border-bottom: 1px solid var(--border-color);
}
.viewer-wrap {
  flex: 1 0 0;
  display: flex;
}
.tools-box {
  display: flex;
}
.viewer-box {
  position: relative;
}
.render-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px 0;
  box-sizing: border-box;
}
.render-content .pdf-canvas {
  /* box-shadow: 0px 0px 15px 5px #cfcfcf; */
  box-shadow: var(--box-shadow);
}
</style>
