<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
      <el-form-item label="上级菜单：" prop="menuParentId">
            <el-popover placement="bottom" ref="poppverShow" :width="400" trigger="click">
      <template #reference>
        <el-input readonly v-model="inputValue" ></el-input>
      </template>
                <el-tree
                  :data="TreeData"
                  :props="defaultProps"
                  node-key="id"
                  :default-expanded-keys="defaultChecked"
                  @node-click="chooseMenu"
                ></el-tree>
    </el-popover>
      </el-form-item>
      <el-form-item label="菜单类型：" prop="menuType">
          <el-radio-group v-model="form.menuType">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
      </el-form-item>
		<el-form-item label="图标：" prop="menuIcon">
			  <el-input readonly @click="chooseIcon" v-model="form.menuIcon">
          <template #append>
            <i class="iconfont" :class="form.menuIcon? form.menuIcon : 'icon-deploy'"></i>
          </template>
        </el-input>
		</el-form-item>
        <el-form-item label="名称：" prop="menuName">
        <el-input v-model="form.menuName" placeholder="">
        </el-input>
      </el-form-item>
      <el-form-item label="路由地址：" prop="menuPath" v-if="form.menuType !== 3">
        <el-input v-model="form.menuPath" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="permission" v-if="form.menuType == 3">
        <el-input v-model="form.permission" placeholder=""></el-input>
      </el-form-item>
            <el-form-item label="排序：" prop="cOrder">
               <el-input-number v-model="form.cOrder" :min="1" :max="99" title=""/>
      </el-form-item>
    </el-form>
  </Layer>
  <Layer :layer="layerIcon" ref="layerIcon">
  <div class="iconbox">
        <div v-for="(item,index) in iconArr" class="iconfont iconSize" :key="index" :class="item" @click="addicon(item)"></div>
  </div>
  </Layer>
</template>

<script lang="ts" setup>
  import type { LayerType } from '@/components/layer/index.vue'
  import { reactive, Ref } from 'vue'
  import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
  import { defineComponent, ref} from 'vue'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'
  import { menuQuery } from '@/api/user/permission'
  import Layer from '@/components/layer/index.vue'
  import { iconArr } from './icon'

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

  const form = ref({
    menuParentId: '1',
    menuType: 1,
    menuIcon:'',
    menuName: '',
    menuPath: '',
    cOrder: 1,
    permission:''//接口url
  })
  const defaultProps = {
    children: 'children',
    label: 'menuName',
  }
  const defaultChecked = ref([])
  const inputValue = ref('根目录')
  const value = ref('')
  const optionData = ref({
    id:'',
    menuName:''
  })
  interface Tree {
    label: string
    value: string
    children?: Tree[]
  }
  const emit = defineEmits(['updateForm','addForm'])
  const poppverShow = ref(null)
  const chooseMenu = (node:object)=>{
      inputValue.value = node.menuName
      form.value.menuParentId = node.id
      poppverShow.value.visibility = false
  }
  const TreeData = ref<Tree[]>([])
  const getTableData = () => {
    let params = {
      roleIds:''
    }
    menuQuery(params)
    .then(res => {
      // let data = res.data
      let data = [{
        menuName:'根目录',
        id:'1',
        children: res.data
      }]
      TreeData.value = data
    })
  }
  const chooseIcon = ()=>{
      layerIcon.show = true
      layerIcon.title = '选择图标'
  }
  const layerIcon = reactive({
        show: false,
        title: '',
  })
  const addicon =(item:string)=>{
      layerIcon.show = false;
      form.value.menuIcon = item
  }
   
  const ruleForm: Ref<ElFormItemContext|null> = ref(null)
  const layerDom: Ref<LayerType|null> = ref(null)
  const store = useStore()
  const user = store.state.user.loginInfo

  const rules = {
    menuParentId: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
    menuType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
    menuIcon: [{ required: true, message: '请选择菜单图标', trigger: 'blur' }],
    menuName: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }],
    menuPath: [{ required: true, message: '请填写路由地址', trigger: 'blur' }],
    cOrder: [{ required: true, message: '请填写排序号', trigger: 'blur' }],
    permission: [{ required: true, message: '请填写按钮地址', trigger: 'blur' }],
  }
  const submit= ()=>{
    if (ruleForm.value) {
      ruleForm.value.validate((valid) => {
        if (valid) {
          const data = form.value
          if(props.layer.row){
            emit('updateForm',data)
          }else{
            emit('addForm',data)
          }
        } else {
          return false;
        }
      });
    }
  }
  function init() { // 用于判断新增还是编辑功能
    if (props.layer.row) {
      let row = JSON.parse(JSON.stringify(props.layer.row));
      console.log(row)
      form.value = row
      inputValue.value = row.menuParentName
      defaultChecked.value.push(row.menuParentId)
    } else {
      
    }
    getTableData()
  }
  init()
    
</script>

<style lang="scss" scoped>
  .iconbox{
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      height: 300px;
      overflow: auto;
      .iconSize{
        font-size: 24px;
        padding: 10px;
      }
  }
</style>