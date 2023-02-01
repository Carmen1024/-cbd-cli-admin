<!--  -->
<template>
  <Layer :layer="layer" ref="layerDom" :show-close="false" :pressescape="false">
    <div class="progressContainer">
      <div class="title">提示：数据更新中，请等待</div>
      <p>请不要刷新或关闭浏览器</p>
      <div class="progress">
        <el-progress type="circle" :percentage="percentage" :status="status" />
      </div>
      <span v-if="status">{{
        status == "success" ? "保存成功" : "保存失败"
      }}</span>
      <!-- <el-button v-else @click="close">取消更新</el-button> -->
    </div>
  </Layer>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  layer: {
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

const status = ref("");

const percentage = ref(0);

const add = ref();

function addPercent() {
  percentage.value = percentage.value + 1;
  if (percentage.value >= 99) {
    clearInterval(add.value);
  }
}
const emit = defineEmits(["close", "openDown"]);

function close() {
  emit("close");
}

const setStatus = (val) => {
  console.log(val);
  status.value = val;
  clearInterval(add.value);
  if (val == "success") {
    percentage.value = 100;
  }
  setTimeout(() => {
    emit("close");
    if (val == "down") {
      emit("openDown");
    }
  }, 2000);
};

defineExpose({ setStatus });

onMounted(() => {
  console.log("onMounted");
  window.onbeforeunload = function (e) {
    console.log(2, e);
    e = e || window.event;
    if (e) {
      e.returnValue = "您提交的变更还在处理中，是否确认关闭";
    }
    alert("您提交的变更还在处理中，是否确认关闭"); //IE 火狐浏览器提示
    return "您提交的变更还在处理中，是否确认关闭"; //IE 谷歌浏览器提示（opera浏览器只有刷新时提示）
  };
});
onUnmounted(() => {
  console.log("onUnmounted");
  window.onbeforeunload = function () {
    console.log(3);
  };
});

const init = () => {
  percentage.value = 1;
  status.value = "";
  add.value = setInterval(() => {
    addPercent();
  }, 200);
};
init();
</script>

<style lang="scss" scoped>
.progressContainer {
  text-align: center;

  .title {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 16px;
  }
  p {
    font-size: 14px;
    color: var(--el-color-danger);
  }
  .progress {
    margin: 20px 0;
  }
}
</style>
