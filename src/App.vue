<template>
  <div class="fake-box">
    <pdf-annotate
      src="http://183.131.134.242:1889/files/20210619/383518b085f9469eb9ec34594196f8c7.pdf"
    ></pdf-annotate>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeVars } from "naive-ui";
import { PdfAnnotate } from "../packages/";
export default defineComponent({
  name: "App",
  components: {
    PdfAnnotate,
  },
  setup() {
    const themeVars = useThemeVars();
    return {
      boxShadow: themeVars.value.boxShadow1,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.fake-box {
  box-shadow: v-bind(boxShadow);
  width: 100%;
  max-width: 600px;
  height: 600px;
}
</style>
