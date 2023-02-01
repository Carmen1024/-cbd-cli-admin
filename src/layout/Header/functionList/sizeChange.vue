<template>
  <el-dropdown @command="handleCommand" size="medium">
    <span class="el-dropdown-link">
      <i class="iconfont icon-Word"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="d in list"
          :key="d.size"
          :command="d.size"
          :disabled=" elementSize === d.size "
        >
          {{ $t(d.name) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { defineComponent, computed, unref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useStore } from 'vuex'

    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const elementSize = computed(() => store.state.app.elementSize)
    const list = [
      { size: 'default', name: 'message.system.size.default' },
      { size: 'medium', name: 'message.system.size.medium' },
      { size: 'small', name: 'message.system.size.small' },
      { size: 'mini', name: 'message.system.size.mini' },
    ]
    const { fullPath } = unref(route)

    function handleCommand(command: string) {
      store.commit('app/stateChange', {
        name: 'elementSize',
        value: command
      })
      setElementSize()
    }
    function setElementSize() {
      // $ELEMENT.size = elementSize
      router.replace({
        path: "/redirect" + fullPath
      })
    }

</script>

<style lang="scss" scoped>
  .iconfont{
    cursor: pointer;
  }
</style>