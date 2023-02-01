<template>
  <div class="formContainer">
    <el-form :ref="formRef" :model="form" :rules="rules" label-width="120px">
      <slot></slot>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent,watch,onMounted } from 'vue'
  
  // do not use same name with ref
  const props = defineProps({
      rules:{
        type: Object,
        default: () => {
          return {}
        }
      },
      form:{
        type: Object,
        default: () => {}
      },
      formRef:{
        type: String,
        default: "formRef"
      },
  })
  
  console.log("props.rules:",props.rules)
</script>
<style lang="scss">
    .formContainer{
      max-width: 1000px;
      .el-form{
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          width: 50%;
          text-align: left;
        }
      }
    }
</style>
