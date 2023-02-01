<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
			<el-form-item label="邮箱：" prop="new">
			  <el-input v-model="form.mail" placeholder="请填写邮箱地址"></el-input>
			</el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts">
import type { LayerType } from '@/components/layer/index.vue'
import type { Ref } from 'vue'
import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { resetMail } from '@/api/user'
import Layer from '@/components/layer/index.vue'
export default defineComponent({
  components: {
    Layer
  },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
      }
    }
  },
  setup(props, ctx) {
    const ruleForm: Ref<ElFormItemContext|null> = ref(null)
    const layerDom: Ref<LayerType|null> = ref(null)
    const store = useStore()
    let form = ref({
      mail: "",
    })
    const rules = {
      mail: [{ required: true, message: '请填写邮箱地址', trigger: 'blur' }],
    }

    function submit() {
      if (ruleForm.value) {
        ruleForm.value.validate((valid) => {
          if (valid) {
            let params = {
              "set":{
                  "user_mail":form.value.mail
              }
            }
            resetMail(params)
            .then(res => {
              ctx.emit("resetMail",form.value.mail)
              ElMessage({
                type: 'success',
                message: '邮箱绑定成功'
              })
              layerDom.value && layerDom.value.close()
            })
          } else {
            return false;
          }
        });
      }
    }
    return {
      form,
      rules,
      layerDom,
      ruleForm,
      submit,
    }
  },
  
})
</script>

<style lang="scss" scoped>
  
</style>