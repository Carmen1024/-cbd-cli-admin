<!-- 简略版实例 -->
<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
     <user-mode :users="users" @changeUsers="changeUsers"  />
  </Layer>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue'

  import Layer from '@/components/layer/index.vue'
  import UserMode from '@/components/user/index.vue'
  import { queryListByGroupId } from '@/api/group/userGroup'

  const props =defineProps({
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
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
    
  const form=ref({
    showButton:true,
    row:null
  })
  const users = ref([])
  init()
  function init() { // 用于判断新增还是编辑功能
    if (props.layer.row) {
      // let row = JSON.parse(JSON.stringify(props.layer.row));
      // form.value.row = row // 数量量少的直接使用这个转
      const params = {id:props.layer.row.id}
      queryListByGroupId(params).then(res=>{
          users.value = res.data
      })
      
    } else {

    }
  }
  const emit = defineEmits(["updateForm","addForm"])
  // const updateForm = (params: object)=>{
  //   emit("updateForm",params)
  // }
  // const addForm = (params: object)=>{
  //   emit("addForm",params)
  // }
  const changeUsers=(ids:Array<object>,isChecked:boolean)=>{
    //选择的id 选中还是取消
    ids.map(item=>{
        const user = users.value.find(d => d.id == item.id)
        if(!isChecked){
          //删除 或反选
          const i = users.value.indexOf(item)
          users.value.splice(i,1)
        }else{
          //选择
          if(!user){
            users.value.push(item)
          }
        }
    })
  }
  const submit=()=>{
    let row = JSON.parse(JSON.stringify(props.layer.row));
    console.log(row)
    row.userIdList = users.value.map(item=>item.id)
    console.log(row)
    emit("updateForm",row)
  }

</script>

<style lang="scss" scoped>
  .el-form{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // padding: 15px 15px 0;
  }
</style>