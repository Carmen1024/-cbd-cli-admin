<template>
  <el-form 
    :model="model" 
    :rules="rules" 
    style="margin-right:30px;"
  >
    <el-form-item 
      v-for="(item,index) in itemArr"
      :key="index"
      :label="item.label" 
      :prop="item.prop"
      :style="`width:${item.width || '50%'};`"
      :label-width="`${item.type == 'title'?'0':'120px'}`"
    >
      <p v-if="item.type == 'title'">
        {{item.placeholder}}
      </p>
      <!-- 输入框 -->
      <el-input 
        v-if="item.type=='input'"
        v-model="model[item.prop]"
        :placeholder="item.placeholder"
        :disabled="item.disabled || false"
        >
      </el-input>
      <!-- 文本框 -->
      <el-input
        v-if="item.type=='textarea'"
        v-model="model[item.prop]"
        :rows="2"
        type="textarea"
        :placeholder="item.placeholder"
      />
      <!-- 开关 -->
      <el-switch
        v-if="item.type=='switch'"
        v-model="model[item.prop]"
        :active-text="item.activeText || '是'"
        :inactive-text="item.inactiveText || '否'"
      >
      </el-switch>
      <el-select 
        v-if="item.type == 'select'" 
        v-model="model[item.prop]"
        :placeholder="item.placeholder || '请选择'">
        <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue'
  import type { Ref } from 'vue'
  import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
  export interface formInterface {
    title:string;
    showButton?:boolean;
    [propName: string]: any;
  }

  const props = defineProps({
    model: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rules:{
      type: Array,
      default: () => {
        return []
      }
    },
    itemArr:{
      type: Array,
      default: () => {
        return []
      }
    }
  })
    
</script>

<style lang="scss" scoped>
    .el-form{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      // padding: 15px 15px 0;
      .el-form-item{
        width: 50%;
        p{
          width: 100%;
          margin:0 10px;
          line-height: 40px;
          border-bottom: solid 1px #ddd;
          text-align: left;
          font-size: 16px;
          color:#303133;
        }
      }
    }
</style>