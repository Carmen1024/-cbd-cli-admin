<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
      <el-form-item label="手机号：" prop="name">
        <el-input :disabled="user.name?true:false" v-model="form.phone" placeholder="请填写手机号"></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="old">
        <el-input v-model="form.code" placeholder="请填写验证码">
        </el-input>
        <el-button @click="sendCode" :disabled="sendDisabled" type="primary" style="margin-left:10px;" >
          {{sendMsg}}
        </el-button>
      </el-form-item>
			<el-form-item label="新密码：" prop="new">
			  <el-input v-model="form.pass" placeholder="请填写新密码" :type="passwordType?'password':''">
          <template #append>
            <i class="iconfont" :class="passwordType ? 'icon-closeeye': 'icon-eye'" @click="passwordTypeChange"></i>
          </template>
        </el-input>
			</el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts" setup>
  import type { LayerType } from '@/components/layer/index.vue'
  import type { Ref } from 'vue'
  import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
  import { defineComponent, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'
  import { passwordChange,sendPhoneCode } from '@/api/user'
  import {encryptByAES} from '@/utils/transform/encryptionTool'
  import Layer from '@/components/layer/index.vue'

  const props = defineProps({
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButtons: true
        }
      }
    }
  })
  const ruleForm: Ref<ElFormItemContext|null> = ref(null)
  const layerDom: Ref<LayerType|null> = ref(null)
  const store = useStore()
  const user = store.state.user.loginInfo
  let form = ref({
    phone: user.name || '',
    code: '',
    pass: ''
  })
  const rules = {
    code: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
    pass: [{ required: true, message: '请填写新密码', trigger: 'blur' }],
  }

  const passwordType = ref(true)
  const passwordTypeChange=()=>{
    passwordType.value = passwordType.value ? false : true
  }
  const sendDisabled=ref(false)

  const sendMsg = ref("发送验证码")

  const timeCodeMsg=(time:any)=>{
    if(time<1){
      sendDisabled.value = false
      sendMsg.value="重新发送验证码"
      return
    }
    sendMsg.value = time + "s后重新获取"
    setTimeout(() => {
        timeCodeMsg(--time)
      }, 1000);
  }

  const sendCode=()=>{
    const params={
      "eq":{
          "user_phone":form.value.phone
      }
    }
    sendPhoneCode(params).then(res=>{
      sendDisabled.value = true
      timeCodeMsg(60)
      store.commit("user/verificationCodeKeyChange",res.data)
      ElMessage({
        type: 'success',
        message: '验证码发送成功'
      })
    })
  }


  function submit() {
    if (ruleForm.value) {
      ruleForm.value.validate((valid) => {
        if (valid) {
          let { phone:user_phone , code , pass:user_pass} = form.value
          const key = 'sQPoC/1do9BZMkg8I5c09A=='
          user_pass = encryptByAES(user_pass, key, key)
          let params = {
            "eq":{
                user_phone
            },
            "set":{
              user_pass
            },
            sign_type : "1",
            verificationCode:parseInt(code),
            verificationCodeKey:store.state.user.verificationCodeKey
          }
          passwordChange(params)
          .then(res => {
            ElMessage({
              type: 'success',
              message: '密码修改成功'
            })
            layerDom.value && layerDom.value.close()
            setTimeout(() => {
              store.dispatch('user/loginOut')
            }, 2000)
          })
        } else {
          return false;
        }
      });
    }
  }
</script>

<style lang="scss" scoped>
  
</style>