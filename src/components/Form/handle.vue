<!-- 操作栏 -->
<template>
  <div class="layout-container-form flex space-between">
    <div class="layout-container-form-handle">
      <div v-for="(item, index) in condition" :key="index" class="condition">
        <el-select
          v-if="item.type == 'select'"
          v-model="query[item.prop]"
          @change="changeQuery"
          :placeholder="item.placeholder || '请选择'"
        >
          <el-option :label="item.placeholder || '全部'" :value="null" />
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
            v-if="item.type == 'selectOptions'"
            v-model="query[item.prop]"
            @change="changeEvent"
            :placeholder="item.placeholder || '请选择'"
        >
          <el-option :label="item.placeholder || '全部'" :value="null" />
          <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />
        </el-select>
        <el-select
            v-if="item.type == 'storeSerch'"
            v-model="query[item.prop]"
            filterable
            clearable
            remote
            reserve-keyword
            :placeholder="item.placeholder || '请选择'"
            :remote-method="remoteMethod"
            :loading="loading">
          <el-option
              v-for="option in storeOption"
              :key="index"
              :label="option.label"
              :value="option.value">
          </el-option>
        </el-select>
        <el-input
          v-if="item.type == 'input'"
          v-model="query[item.prop]"
          :disabled="item.disabled || false "
          :placeholder="item.placeholder || '请填写'"
          @change="changeQuery"
        >
        </el-input>
        <el-date-picker
          v-if="item.type == 'dateTime'"
          v-model="query[item.prop]"
          :clearable="item.clearable"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="item.placeholder || '请选择时间'"
        />
      </div>
      <div v-for="item in handles" :key="item" class="handle">
        <el-button
          v-if="item == 'search'"
          :icon="Search"
          class="search-btn"
          @click="changeQuery"
        >
          {{ $t("message.common.search") }}
        </el-button>
        <el-button
          v-if="item == 'add'"
          type="primary"
          :icon="Plus"
          @click="handleAdd"
        >
          {{ $t("message.common.add") }}
        </el-button>
        <el-button
          v-if="item == 'export'"
          type="primary"
          :icon="Upload"
          @click="handleExport"
        >
          {{ $t("message.common.exportExcel") }}
        </el-button>
        <el-button
          v-if="item == 'import'"
          type="primary"
          :icon="Download"
          @click="handleImport"
        >
          {{ $t("message.common.importFile") }}
        </el-button>
        <el-button
          v-if="item == 'addOrder'"
          type="success"
          :icon="CirclePlusFilled"
          @click="handleAddOrder"
        >
          {{ $t("message.common.addOrder") }}
        </el-button>
      </div>

      <div v-if="condition.length > 0" class="handle">
        <el-button
          type="primary"
          plain
          :icon="RefreshLeft"
          @click="handleClear"
        >
          {{ $t("message.common.clear") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, watch } from "vue";
import {
  Plus,
  Search,
  Delete,
  RefreshLeft,
  Upload,
  Download,
  CirclePlusFilled,
} from "@element-plus/icons";
import {useRouter, useRoute} from 'vue-router';
import tabsHook from '@/layout/Tabs/tabsHook'
import {baseRequest} from '@/api/baseApi'
const props = defineProps({
  handles: {
    type: Array,
    default() {
      return ["search", "add"];
    },
  },
  condition: {
    type: Array,
    default() {
      return [];
    },
  },
  query: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emit = defineEmits(["handleAdd", "handleClear","changeEvent","getTableData",'update:query']);

const loadingTable = ref(true);
const loading = ref(false);
const router = useRouter()

const route = useRoute()
const  storeOption = ref([])
const menuList = ref(tabsHook.getItem())
const remoteMethod = (query) => {
  if (query !== '') {
    let params = {
      s_name:query
    }
    loading.value = true;
      baseRequest('/orderMp/findStoreByName',params).then(
          (data)=>{
            loading.value = false;
            storeOption.value = data.data.map((item)=>{
                return { value: item, label: item};
            });
      }).catch(()=>{
        storeOption.value = [];
      })
    }
   else {
    storeOption.value = [];
  }
}
watch(menuList.value, (newVal: []) => {
  console.log("handle")
  tabsHook.setItem(newVal)
})

const getTableData = () => {

  setTimeout(() => {
    loadingTable.value && emit("getTableData", true);
  }, 200);
};
// 选项发生了变化
const changeQuery = async () => {
  let page = menuList.value.find(item=>item.path == route.path) ?
      menuList.value.find(item=>item.path == route.path) :
      {}
  console.log("page前:",page,'------------',menuList.value)
  page.searchItems = props.query
  // tabsHook.setItem(menuList.value)
  // console.log("page后:",page)
  getTableData()
};
const changeEvent = () => {
  emit("changeEvent");
}
const handleAdd = () => {
  emit("handleAdd");
};
const handleExport = () => {
  emit("handleExport");
};
const handleImport = () => {
  emit("handleImport");
};
const handleAddOrder = () => {
  emit("handleAddOrder");
};
const handleClear = () => {
  loadingTable.value = false;
  emit("handleClear");
  setTimeout(() => {
    loadingTable.value = true;
  }, 1000);
};
function init(){
  const page = menuList.value.find(item=>item.path == route.path)
  console.log(page,page?.searchItems)
  if(page?.searchItems){
    // let q = props.query
    // query.value = page?.searchItems
    console.log(props.query,page?.searchItems)
    emit("update:query",page?.searchItems)
    getTableData()
    console.log(props.query,page?.searchItems)
  }else{
    getTableData()
  }
}
init()
</script>
<style lang="scss" scoped>
.layout-container-form-handle {
  // max-width: 1000px;
  display: flex;
  flex-wrap: wrap;

  .condition {
    margin: 0 10px 10px 0;
    min-width: 200px;
  }

  .handle {
    margin: 0 10px 10px 0;
    // margin-right: 10px;
  }
}
</style>
