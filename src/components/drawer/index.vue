<!-- 抽屉 -->
<template>
  <div class="drawerContainer">
    <el-drawer
      v-model="drawer.show"
      :title="drawer.title"
      :direction="direction"
      :before-close="handleClose"
      :with-header="drawer.title"
      :size="drawer.width || '30%'"
    >
      <div class="drawer_main"><slot></slot></div>
      <div class="demo-drawer__footer" v-if="drawer.showButton">
        <el-button type="primary" :loading="drawer.loading" @click="confirm"
          >确认</el-button
        >
        <el-button @click="close">取消</el-button>
      </div>
      <div class="demo-drawer__footer" v-else>
        <el-button
          type="warning"
          v-if="drawer.original"
          @click="turnOrder()"
          :loading="drawer.loading"
          >商品驳回</el-button
        >
        <el-button
          type="success"
          v-if="drawer.refund && drawer.showRefund"
          @click="refund(1)"
          >审核通过
        </el-button>
        <el-button
          type="warning"
          v-if="drawer.refund && drawer.showRefund"
          @click="refund(2)"
          >审核拒绝
        </el-button>
		    <el-button
          type="info"
          v-if="drawer.refund && drawer.showRefund && drawer?.row?.orderType == '退货单'"
          @click="refund(4)"
          >驳回修改</el-button
        >
        <el-button
          type="primary"
          v-if="drawer?.row?.orderType == '退货单'"
          @click="refund(5)"
          >保存备注
        </el-button>
		    <el-button
          type="primary"
          v-if="drawer.showNext"
		      @click="change('next')"
          >下一步</el-button
        >
		    <el-button
          type="primary"
          v-if="drawer.showPre"
		      @click="change('pre')"
          >上一步</el-button
        >
		    <el-button
          type="success"
          v-if="drawer.showPre"
		      @click="change('order')"
          >下单</el-button
        >
        <el-button @click="close">关闭</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { type } from "os";
export interface DrawerInterface {
  show: boolean;
  title: string;
  showButton?: boolean;
  width?: string;
  [propName: string]: any;
}
const props = defineProps({
  drawer: {
    type: Object,
    default: () => {
      return {
        show: false,
        title: "",
        showButton: true,
      };
    },
  },
});
const direction = ref("rtl");
const handleClose = (done: () => void) => {
  if (props.drawer.close) {
    props.drawer.show = false;
  } else {
    ElMessageBox.confirm("关闭前请确认已保存")
      .then(() => {
        done();
      })
      .catch(() => {
        // catch error
      });
  }
};
const emit = defineEmits(["confirm", "refund", "turnOrder","change"]);

function confirm() {
  emit("confirm");
}
function refund(flag: boolean) {
  emit("refund", flag);
}
function change(action:String) {
  emit("change", action);
}
function turnOrder() {
  emit("turnOrder");
}
const close = () => {
  props.drawer.show = false;
};
</script>
<style lang="scss">
.el-drawer__header {
  margin-bottom: 0;
  // border-bottom: solid 1px #ddd;
}
.el-drawer__body {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .drawer_main {
    overflow-y: scroll;
    height: 100%;
  }
  .demo-drawer__footer {
    border-top: solid 1px #ddd;
    margin-top: 10px;
    padding-top: 10px;
    // height: 50px;
  }
}
</style>
