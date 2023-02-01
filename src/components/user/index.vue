<!--  -->
<template>
   <div class="user-container">
    <div class="user-container-top">
      <div class="user-data">
        <div class="user-data-handle">
          <el-checkbox v-model="allChecked" label="全选" size="large" @change="changePageUsers" />
          <el-input v-model="query.user_phone" @change="getTableData" placeholder="查询用户手机号" />
          <el-input v-model="query.user_name" @change="getTableData" placeholder="查询用户姓名" />
          <el-button type="primary" @change="getTableData">查询</el-button>
        </div>
        <div class="user-data-data">
          <div v-for="(item,index) in userData" :key="index">
            <el-checkbox 
              v-model="item.checked" 
              :label="`${item.name}(${item.user_name})`"
              size="large"
              @change="changeUser(item)"
            />
          </div>
        </div>
        <div class="user-data-page">
          <pagination-mode 
            :page="page" 
            @getTableData="getTableData"
          />
        </div>
      </div>
    </div>
    <div class="user-container-bottom">
      <div class="user-data-handle">已选择的用户</div>
      <div class="user-bottom-data">
        <div v-for="(item,index) in users" :key="index">
          {{item.name}}
          <span 
            class="icon iconfont icon-close" 
            @click="removeUser(item)"
          >
          </span>
        </div>
      </div>
    </div>
   </div>
</template>

<script lang='ts' setup>
  import { defineComponent,ref,reactive } from 'vue'
  import { useStore } from 'vuex'
  import { groupQuery } from '@/api/group/group'
  import { manageUserQuery } from '@/api/user/user'
  import { Page } from '@/components/table/type'
  import PaginationMode from '@/components/pagination/index.vue';

  const store = useStore()

  const props = defineProps({
    users:{
      type:Array,
      default:()=>{
        return []
      }
    }
  })
  // 分页参数, 供table使用
  const page: Page = reactive({
    index: 1,
    size:  10,
    total: 0
  })
  const query = ref({})
  const allChecked = ref(false)

  const groups = ref([])
  const userData = ref([])

  function getGroups(){
    return new Promise((resolve,reject)=>{
      const data = store.state.enum.saleGroup
      if(data?.length>0){
        resolve(data)
      }
      store.dispatch('enum/getSaleGroup').then(res=>{
        resolve(res)
      })
    })
  }
  

  function getTableData(init: boolean){
    if (init) {
      page.index = 1
    }
    allChecked.value = false
    userData.value = []

    let params = {
      start: <number>page.index - 1,
      size: page.size,
      ...query.value
    }
    manageUserQuery(params).then(res => {
      res.data.map(item=>{
        const user = props.users.find(d => d.id == item.id)
        if(user){
          item.checked = true
        }else{
          item.checked = false
        }
        item.name = item.user_phone
        // item.id = item._id
      })
      console.log(res.data)
      userData.value = res.data
      page.total = res.total
    }).catch(error => {
      userData.value = []
      page.index = 1
      page.total = 0
    })
  }

  init()
  async function init(){
    getTableData(true)
  }
  const emit = defineEmits(["changeUsers"])
  function changePageUsers(){
    const checked = allChecked.value ? true : false
    const ids=userData.value.map(item=>{
      item.checked = checked
      return {name:item.name,id:item.id}
    })
    emit("changeUsers",ids,checked)
  }
  function changeUser(item:object){
    const ids=[
      {name:item.name,id:item.id}
    ]
    emit("changeUsers",ids,item.checked)
  }
  function removeUser(item:object){
    const user = userData.value.find(d=> d.id == item.id)
    if(user) user.checked = false
    const ids=[item]
    emit("changeUsers",ids,false)
  }
</script>
<style lang='scss' scoped>
  .user-container{
    .user-data-handle{
      padding-left: 10px;
      height: 40px;
      line-height: 40px;
      background-color: #f5f5f5;
      border-bottom: solid 1px #ddd;
      font-weight: bold;
      color:#000;
    }
    &-top{
      height: 300px;
      display: flex;
      justify-content: space-between;
      border: solid 1px #ddd;

      .user-data{
        flex: 3;
        height: 300px;
        // overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        // border-left: solid 1px #ddd;
        &-handle{
            width: 100%;
            display: flex;
            align-items: center;
        }
        &-data{
          // display: flex;
          // justify-content: flex-start;
          // flex-wrap: wrap;
          padding-left: 10px;
          width: 100%;
          height: 200px;
          overflow-y: auto;
          div{
            float: left;
            width: 50%;
            height: 40px;
          }
        }
        &-page{
          padding:10px;
          width: 100%;
          background-color: #f5f5f5;
        }
      }
    }
    &-bottom{
      height: 200px;
      border: solid 1px #ddd;
      .user-bottom-data{
        height: 160px;
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
        align-items: flex-start;
        div{
          display: flex;
          margin: 5px;
          padding:0 5px;
          border: solid 1px var(--system-primary-color);
          border-radius: 5px;
          color: #999;
          font-size: 12px;
          line-height: 26px;
          span{
            padding-left: 3px;
            color: var(--system-primary-color);
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .user-data-handle{
    .el-input{
      margin:0 10px;
      width: 200px;
    }
  }

</style>