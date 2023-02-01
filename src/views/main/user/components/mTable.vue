<!-- 表格-基础模板 -->
<template>
  <div class="layout-container-table">
    <Table
      ref="table"
      v-model:page="page"
      v-loading="loading"
      :showIndex="showNIndex"
      :showSelection="false"
      :data="tableData"
      @getTableData="getTableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-for="(item,index) in columnArr" :key="index"
          :prop="item.prop" 
          :label="item.label"
          align="center" 
      >
        <template #default="scope" v-if="item.type=='handle'">
          <el-switch 
            v-model="scope.row[item.prop]" 
            @change="tableHandle('valid',scope.row)"
          />
        </template>
        <template #default="scope" v-if="item.type=='formatter'">
          <span v-html="item.formatter(scope.row[item.prop], scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" :width="handles.length * 100">
        <template #default="scope">
          <span v-for="(handle,index) in handles" :key="index" class="handle-span">
            <el-button v-if="handle.value=='edit'" @click="handleEdit(scope.row)">
              {{handle.label || '编辑'}}
            </el-button>
            <el-popconfirm v-else-if="handle.value=='delete'"
              :title="$t('message.common.delTip')" 
              @confirm="handleDel(scope.row)">
              <template #reference>
                <el-button type="danger">{{ handle.label || $t('message.common.del') }}</el-button>
              </template>
            </el-popconfirm>
            <!-- 其他的 -->
            <el-button v-else @click="tableHandle(handle.value,scope.row)">
              {{handle.label}}
            </el-button> 
          </span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>

<script lang='ts' setup>
  import Table from '@/components/table/index.vue'

  const props = defineProps({
      columnArr:{
        type:Array,
        default(){
            return []
        }
      },
      tableData:{
        type:Array,
        default(){
            return []
        }
      },
      showNIndex:{
        type:Boolean,
        default(){
            return true
        }
      },
      page:{
        type:Object,
        default(){
            return {}
        } 
      },
      loading:{
        type:Boolean,
        default(){
            return true
        } 
      },
      handles:{
          type:Array,
          default(){
            return [
              { value: "edit", label: '编辑'},
              { value: "delete", label: '删除'}
            ]
          }
      },
  })
  const emit = defineEmits(["getTableData","handleSelectionChange","handleEdit","handleDel","tableHandle"])

  // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
  const getTableData = (val:any) => {
      emit("getTableData",val)
  }
  const handleSelectionChange = (val:any) => {
      emit("handleSelectionChange",val)
  }
  const handleEdit = (row: object) => {
      emit("handleEdit",row)
  }
  const handleDel = (row: object) => {
      emit("handleDel",row)
  }
  const tableHandle = (type:String,row:object)=>{
    emit("tableHandle",{ type,row })
  }
</script>
<style lang='scss' scoped>
  .handle-span + .handle-span{
    padding-left:10px;
  }
</style>