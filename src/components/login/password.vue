<!-- 手机密码登录 -->
<template>
    <el-input
        size="large"
        ref="password"
        v-model="form.password"
        :type="passwordType"
        :placeholder="$t('message.system.password')"
        name="password"
        maxlength="50"
    >
        <template #prepend>
        <i class="iconfont icon-password"></i>
        </template>
        <template #append>
        <i class="iconfont" :class="passwordType ? 'icon-closeeye': 'icon-eye'" @click="passwordTypeChange"></i>
        </template>
    </el-input>
    <el-button type="primary" :loading="loading" @click="submit" style="width: 100%;" size="medium">{{ $t('message.system.login') }}</el-button>
</template>

<script lang='ts' setup>
    import { ref } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter, useRoute } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import {encryptByAES} from '@/utils/transform/encryptionTool'
    const baseURL: any = import.meta.env.VITE_PAGE_URL

    const props = defineProps({
        form:{
            type:Object,
            default(){
                return {
                    name: '',
                    password: '',
                    verifyCode: '',
                }
            }
        }
    })

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const passwordType = ref('password')
    const passwordTypeChange = () => {
        passwordType.value === '' ? passwordType.value = 'password' : passwordType.value = ''
    }
    const loading = ref(false)
    const checkForm = () => {
        loading.value = true
        return new Promise((resolve, reject) => {
            const {name,password} = props.form
            if (name == '') {
                loading.value = false
                ElMessage.warning({
                    message: '用户名不能为空',
                    type: 'warning'
                });
                
                return;
            }
            if (password === '') {
                loading.value = false
                ElMessage.warning({
                    message: '密码不能为空',
                    type: 'warning'
                })
                return;
            }
            resolve(true)
        })
    }
    const submit = () => {
      let {name,password} = props.form
      //密码加密提交
      const key = 'sQPoC/1do9BZMkg8I5c09A=='
      password = encryptByAES(password, key, key)
        checkForm().then(() => {
            loading.value = false
            let params = {
                name,
                password
            }
            store.dispatch('user/login', params).then(async () => {
                loading.value = true
                ElMessage.success({
                    message: '登录成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                })

                setTimeout(() => {
                    window.location.href = `${baseURL}`
                }, 1000);
            }).finally(() => {
            })
        })
    }
</script>
<style lang='scss' scoped>
    @import './login.scss';
</style>