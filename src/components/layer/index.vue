<template>
  <div>
    <el-dialog
      v-model="layer.show"
      :title="layer.title"
      :width="layer.width"
      :show-close="showClose"
      :close-on-click-modal="showClose"
      :close-on-press-escape="pressescape"
      center
      draggable
    >
      <slot></slot>
      <template #footer v-if="layer.showButtons">
        <div>
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch, Ref } from "vue";
// import drag from '@/directive/drag/index'
// import { UseDialogProps } from 'element-plus/lib/el-dialog/src/dialog'
export interface LayerInterface {
  show: boolean;
  title: string;
  showButtons?: boolean;
  width?: string;
  [propName: string]: any;
}
// interface SystemDialogProps extends UseDialogProps {
//     handleClose: Function;
// }
export interface LayerType {
  close: Function;
}
const emit = defineEmits(["confirm"]);
const props = defineProps({
  layer: {
    type: Object,
    default: () => {
      return {
        show: false,
        title: "",
        showButtons: false,
      };
    },
    required: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  pressescape: {
    type: Boolean,
    default: true,
  },
});
function confirm() {
  emit("confirm");
}
function close() {
  props.layer.show = false;
}
</script>

<style lang="scss">
.el-form-item .el-form-item {
  margin-bottom: 18px;
}
</style>
