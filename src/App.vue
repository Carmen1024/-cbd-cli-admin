<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const i18n = useI18n()
  const locale = computed(() => {
    return {
      name: i18n.locale.value,
      el: i18n.messages.value[i18n.locale.value].el
    }
  })
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
</style>
