import { NIcon } from "naive-ui";
import { h } from "vue";

export const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
