<!-- 抽屉 -->
<template>
   <div class="drawerContainer">
       <el-drawer
          v-model="drawer.show"
          :title="drawer.title"
          :direction="direction"
          :before-close="handleClose"
          :with-header="drawer.title"
          :size="drawer.width || '30%'"
        >
          <div class="drawer_main"><slot></slot></div>
          <div class="demo-drawer__footer" v-if="drawer.showButton">
            <div v-for="(item,index) in drawer.buttons" :key="index" class="btn">
              <el-button v-if="item.handle=='submit'" type="primary" :loading="loading" @click="confirm">
                  {{item.label}}
              </el-button>
              <el-button v-else-if="item.handle=='close'" @click="close">
                  {{item.label}}
              </el-button>
              <el-button v-else :type="item.type" @click="drawerHandle(item.handle)">{{item.label}}</el-button>
            </div>
          </div>
          <div class="demo-drawer__footer" v-else>
            <el-button @click="close">关闭</el-button>
          </div>
        </el-drawer>
   </div>
</template>

<script lang='ts' setup>
  import { defineComponent,ref } from 'vue'
  import { ElMessageBox } from 'element-plus'
  export interface DrawerInterface {
    show: boolean;
    title: string;
    showButton?: boolean;
    width?: string;
    [propName: string]: any;
  }
  const props = defineProps({
      drawer:{
        type: Object,
        default: () => {
            return {
                show: false,
                title:'',
                showButton:true,
                buttons:[
                  {label:"确认",type:"primary",handle:"submit"},
                  {label:"取消",handle:"close"},
                ]
            }
        }
      }
  })
  const direction = ref('rtl')
  const handleClose = (done: () => void) => {
      ElMessageBox.confirm('关闭前请确认已保存')
          .then(() => {
          done()
          })
          .catch(() => {
          // catch error
          })
  }
  const emit = defineEmits(["confirm","drawerHandle"])
  
  function confirm() {
    emit('confirm')
  }
  const close=()=>{
    props.drawer.show = false
  }
  const drawerHandle=(type:string)=>{
    emit('drawerHandle',type)
  }
</script>
<style lang='scss'>
  .el-drawer__header{
    margin-bottom: 0;
    // border-bottom: solid 1px #ddd;
  }
  .el-drawer__body{
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .drawer_main{
      overflow-y: scroll;
      height: 100%;
    }
    .demo-drawer__footer{
      border-top: solid 1px #ddd;
      margin-top: 10px;
      padding-top: 10px;
      display: flex;
      .btn{
        margin-right: 10px;
      }
      // height: 50px;
    }
  }

</style>