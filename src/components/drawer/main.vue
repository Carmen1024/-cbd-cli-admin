<template>
  <div class="form-main">
    <el-form
      :model="model"
      :rules="rules"
      ref="ruleForm"
      style="margin-right: 30px"
    >
      <el-form-item
        v-for="(item, index) in itemArr"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :style="`width:${item.width || '50%'};`"
        :label-width="`${
          item.type == 'title' || item.type == 'slotSecond' ? '0' : '120px'
        }`"
      >
        <p v-if="item.type == 'title'">
          {{ item.placeholder }}
        </p>
        <!-- 输入框 -->
        <el-input
          v-if="item.type == 'input'"
          v-model="model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled || false"
          :maxlength="item.maxlength || null"
          :show-word-limit="item.showlimit || false"
        >
        </el-input>
        <!-- 长度输入框 -->
        <el-input
          v-if="item.type == 'maxinput'"
          v-model="model[item.prop]"
          :placeholder="item.placeholder"
          @input="widthCheck"
          :disabled="item.disabled || false"
        >
        </el-input>
        <!-- 文本框 -->
        <el-input
          v-if="item.type == 'textarea'"
          v-model="model[item.prop]"
          :rows="item.row || 2"
          type="textarea"
          :disabled="item.disabled || false"
          :placeholder="
            item.placeholder || '请填写' + item.label.replace('：', '')
          "
        />
        <!-- 开关 -->
        <el-switch
          v-if="item.type == 'switch'"
          v-model="model[item.prop]"
          :disabled="item.disabled || false"
          :active-text="item.activeText || '是'"
          :inactive-text="item.inactiveText || '否'"
        >
        </el-switch>
        <!-- 选择框 -->
        <el-select
          v-if="item.type == 'select'"
          v-model="model[item.prop]"
          :placeholder="
            item.placeholder || '请选择' + item.label.replace('：', '')
          "
          :disabled="item.disabled || false"
          @change="selectChange"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <!-- checkbox -->
        <el-checkbox-group
          v-model="checkboxGroup"
          v-if="item.type == 'checkboxButton'"
        >
          <el-checkbox-button
            v-for="(boxOption, index) in item.options"
            :key="index"
            :label="boxOption.value"
          >
            {{ boxOption.label }}
          </el-checkbox-button>
        </el-checkbox-group>
        <!-- 地区选择器 -->
        <area-module
          v-if="item.type == 'area'"
          :area-group="model[item.prop]"
          @change="changeArea"
        />
        <el-date-picker
          v-if="item.type == 'dateTime'"
          v-model="model[item.prop]"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="
            item.placeholder || '请选择' + item.label.replace('：', '')
          "
        />
        <el-date-picker
          :disabled="item.disabled || false"
          v-if="item.type == 'daterange'"
          v-model="model[item.prop]"
          type="daterange"
          :range-separator="item.separator"
          :start-placeholder="item.startplaceholder"
          :end-placeholder="item.endplaceholder"
          value-format="YYYY-MM-DD"
        />
        <el-time-picker
          :disabled="item.disabled || false"
          v-if="item.type == 'time'"
          v-model="model[item.prop]"
          value-format="hh:mm:ss"
          :placeholder="item.placeholder || '请选择时间'"
        />
        <el-radio-group 
          v-if="item.type == 'radio'"
          v-model="model[item.prop]"
        >
          <el-radio
            v-for="option in item.options"
            :key="option.value"
            :label="option.value"
          >{{option.label}}</el-radio>
        </el-radio-group>
        
      </el-form-item>
    </el-form>
    <div class="btns" v-if="form.showButton">
      <el-button type="primary" @click="submit">保存</el-button>
      <!-- <el-button>取消</el-button>
      <el-popconfirm :title="'取消后数据将丢失'" @confirm="cancel">
        <template #reference>
          <el-button>取消</el-button>
        </template>
      </el-popconfirm> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import type { Ref } from "vue";
import type { ElFormItemContext } from "element-plus/lib/el-form/src/token";
import FormNormal from "@/components/Form/normal.vue";

export interface formInterface {
  title: string;
  showButton?: boolean;
  [propName: string]: any;
}

const props = defineProps({
  form: {
    type: Object,
    default: () => {
      return {
        showButton: true,
      };
    },
  },
  rules: {
    type: Array,
    default: () => {
      return [];
    },
  },
  itemArr: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits([
  "updateForm",
  "addForm",
  "close",
  "selectChange",
  "widthCheck",
]);
const ruleForm: Ref<ElFormItemContext | null> = ref(null);

const model = ref({});
const checkboxGroup = ref([]);

function init() {
  // 用于判断新增还是编辑功能
  if (props.form.row) {
    let row = JSON.parse(JSON.stringify(props.form.row));
    model.value = row;
  } else {
    // 默认值
    props.itemArr.map((item) => {
      model.value[item.prop] = item.default ? item.default : null;
    });
  }
}
init();

const submit = () => {
  console.log(props.form.row);
  if (ruleForm) {
    ruleForm.value.validate((valid) => {
      if (valid) {
        let params = model.value;
        if (props.form.row) {
          emit("updateForm", params);
        } else {
          emit("addForm", params);
        }
      } else {
        return false;
      }
    });
  }
};
defineExpose({ submit });
const cancel = () => {
  emit("close");
};

function changeArea(areaGroup: any) {
  model.value.areaGroup = areaGroup;
}

function changePictureCard(pictureCard: any) {
  model.value.pictureCard = pictureCard;
}
function selectChange(val: any) {
  emit("selectChange", val);
}
function widthCheck(str: any) {
  let temp = 0;
  for (var i = 0; i < str.length; i++) {
    if (/[\u4e00-\u9fa5]/.test(str[i])) {
      temp += 2;
    } else {
      temp++;
    }
    if (temp > 32) {
      model.value.rCOName = str.slice(0, i);
      return;
    }
  }
}
</script>

<style lang="scss">
.form-main {
  .el-form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // padding: 15px 15px 0;
    p {
      width: 100%;
      line-height: 40px;
      border-bottom: solid 1px #ddd;
      font-size: 16px;
      color: #272727;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
  .btns {
    width: 100%;
    text-align: center;
  }
}
</style>
