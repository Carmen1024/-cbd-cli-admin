<template>
  <div class="container" :style="{backgroundImage:'url('+bg+')'}">
    <div class="login-main">
      <h1>{{ $t(systemTitle) }}</h1>
      <div class="box">
        <div class="logo">
          <img src="@/assets/logo.png" alt="">
        </div>
        <el-form class="form">
          <div class="byCode">
            <span @click="byCode = false" :class="byCode?'':'checked'">账号密码</span>
            <span @click="byCode = true" :class="byCode?'checked':''">手机验证码</span>
          </div>
          <el-input
            size="large"
            v-model="form.name"
            :placeholder="$t('message.system.userName')"
            type="text"
            maxlength="50"
          >
            <template #prepend>
              <i class="iconfont icon-userName"></i>
            </template>
          </el-input>
          <password-mode v-if="!byCode" :form="form" />
          <account-mode :form="form" v-else />
          <div class="login-handle">
            <el-button type="text" @click="showPasswordLayer">忘记密码？</el-button>
          </div>
        </el-form>
        <!-- <div class="fixed-top-right">
          <select-lang />
        </div> -->
      </div>
    </div>
    <password-layer :layer="layer" v-if="layer.show" />
  </div>
</template>

<script lang="ts" setup>
  import { systemTitle } from '@/config'
  import { defineComponent, ref, reactive } from 'vue'
  import { useStore } from 'vuex'
  import selectLang from '@/layout/Header/functionList/word.vue'
  import bg from "@/assets/images/bg.png"
  import passwordMode from '@/components/login/password.vue'
  import accountMode from '@/components/login/account.vue'
  import passwordLayer from '@/components/login/passwordLayer.vue';

  const byCode = ref(false)
  const form = reactive({
    name: '',
    password: '',
    verifyCode: '',
  })
  const layer = reactive({
    title:'重置密码',
    show: false,
    showButtons: true,
    width:"30%"
  })
  const showPasswordLayer = () => {
    layer.show = true
  }
</script>

<style lang="scss" scoped>
  @import '@/components/login/login.scss';
</style>
