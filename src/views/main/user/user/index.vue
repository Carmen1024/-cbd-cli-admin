<template>
  <div class="layout-container">
    <form-handle
      :condition="condition"
      :query="query"
      @update:query="query = $event"
      @getTableData="getTableData"
      @handleAdd="handleAdd"
      @handleClear="handleClear"
    />
    <table-normal
      :columnArr="columnArr"
      :tableData="tableData"
      :page="page"
      :loading="loading"
      :handles="tableHandles"
      @getTableData="getTableData"
      @handleSelectionChange="handleSelectionChange"
      @handleEdit="handleEdit"
      @handleDel="handleDel"
      @tableHandle="tableHandle"
    />
    <layer-normal
      :layer="layer"
      :rules="rules"
      :itemArr="itemArr"
      v-if="layer.show"
      @addForm="addForm"
      @updateForm="updateForm"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, computed } from "vue";
import { Page } from "@/components/table/type";
import { ElMessage } from "element-plus";
import LayerNormal from "@/components/layer/normal.vue";
import type { LayerInterface } from "@/components/layer/index.vue";
import {
  manageUserQuery,
  userDelete,
  adminUserInsert,
  userFetch,
  adminUserValid,
  userUpdate,
  dataRoleSelect
} from "@/api/user/user";
import { rolePage } from "@/api/user/permission";
import {
  valTypeData,
  condition,
  columnArr,
  itemArr,
  columnArrStore,
  roleData,
  searchFormat,
  updateFormat,
  rules,
  tableHandles,
} from "./enum";
import FormHandle from "@/components/Form/handle.vue";
import TableNormal from "@/components/table/normal.vue";
import { getData } from "@/utils/transform/httpConfig";
import { useStore } from "vuex";
import {encryptByAES} from '@/utils/transform/encryptionTool'
const store = useStore();

// const itemArrs = computed(()=>{
//   const group = itemArr.find(item => item.prop == 'group_id')
//   group.options = userGroup.value
//   return itemArr
// })

// 存储搜索用的数据
const query = ref({});
const from = ref("");
const userGroup = ref([]);
// const handles = ref(['search'])
// 弹窗控制器
const layer: LayerInterface = reactive({
  show: false,
  title: "新增",
  showButton: true,
  width: "30%",
});
const user_drawer: LayerInterface = reactive({
  show: false,
  title: "查看",
  showButton: false,
  width: "30%",
});
// 分页参数, 供table使用
const page: Page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const loading = ref(true);
const tableData = ref([]);
const chooseData = ref([]);
const departmentIdData = ref([]);

const handleSelectionChange = (val: []) => {
  chooseData.value = val;
};

// 获取表格数据
// params <init> Boolean ，默认为false，用于判断是否需要初始化分页
const getTableData = (init: boolean) => {
  loading.value = true;
  if (init) {
    page.index = 1;
  }
  // const queryData = getData(searchFormat,query.value)
  let params = {
    start: <number>page.index - 1,
    size: page.size,
    ...query.value,
  };

  manageUserQuery(params, from.value)
    .then((res) => {
      console.log(res);
      let data = res.data;
      if (Array.isArray(data)) {
        data.forEach((d) => {
          const user_val_type = valTypeData.find(
            (item) => item.value === d.user_val_type
          );
          d.user_val_type_desc = user_val_type
            ? user_val_type.label
            : d.user_val_type;
          d.c_valid = d.c_valid || d.valid ? true : false;
          d._id = d._id ? d._id : d.id;
        });
      }
      tableData.value = data;
      page.total = res.total;
    })
    .catch((error) => {
      tableData.value = [];
      page.index = 1;
      page.total = 0;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 删除功能
const handleDel = (row: object) => {
  let params = { eq: { _id: row._id }, sign_type: "1" };
  userDelete(params).then((res) => {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getTableData(tableData.value.length === 1 ? true : false);
  });
};
// 新增弹窗功能
const handleAdd = () => {
  layer.title = "新增用户";
  layer.show = true;
  delete layer.row;
};
// 编辑弹窗功能
const handleEdit = (row: object) => {
  layer.title = "编辑用户";
  layer.show = true;
  console.log(row);
  layer.row = row;
};
const handleClear = () => {
  query.value = {};
};
const roleQuery = () => {
  let data = {
    start: 0,
    size: 999,
  };
  rolePage(data).then((res) => {
    // roleData.value = res.data
    let arr = [];
    res.data.forEach((item) => {
      arr.push({
        value: item.id,
        label: item.menuRoleName,
      });
    });

  });
};
roleQuery();
init();
function init() {
  getTableData(true);
}

// 新增提交事件
async function addForm(params: object) {
  let emailbox = mailbox(params.user_email);
  if (!emailbox) {
    return ElMessage({
      type: "warning",
      message: "请填写正确的邮箱",
    });
  }
  params.user_pass = params.user_phone.substring(params.user_phone.length - 6);
  const key = 'sQPoC/1do9BZMkg8I5c09A=='
  params.user_pass = encryptByAES(params.user_pass, key, key)
  adminUserInsert(params, from.value).then((res) => {
    ElMessage({
      type: "success",
      message: "新增成功",
    });
    getTableData(true);
    layer.show = false;
  });
}
// 编辑提交事件
async function updateForm(params: object) {
  let emailbox = mailbox(params.user_email);
  if (!emailbox) {
    return ElMessage({
      type: "warning",
      message: "请填写正确的邮箱",
    });
  }
  const data = getData(updateFormat, params);
  data.sign_type = "1";
  userUpdate(data).then((res) => {
    ElMessage({
      type: "success",
      message: "修改成功",
    });
    getTableData(true);
    layer.show = false;
  });
}
function tableHandle({ type, row }) {
  if (type == "valid") {
    const params = getData({ eq: ["_id"], set: ["c_valid"] }, row);
    adminUserValid(params)
      .then((res) => {
        ElMessage({
          type: "success",
          message: "切换成功",
        });
      })
      .catch((error) => {
        row.c_valid = false;
      });
  }
  if (type == "editPass") {
    const { _id, user_phone } = row;
    let user_pass = user_phone.substring(user_phone.length - 6);
    const key = 'sQPoC/1do9BZMkg8I5c09A=='
    user_pass = encryptByAES(user_pass, key, key)
    updateForm({ _id, user_pass });
  }
  if (type == "openRole") {
    user_drawer.show = true;
    user_drawer.row = row;
  }
  if (type == "dataRole") {
	dataRoleSelect({userId:row.id}).then((res) => {
		role_drawer.show = true;
    	role_drawer.row = row;
		role_drawer.orderData = res.data.orderdata
		role_drawer.orderfield = res.data.orderfield
	})
   
  }
}
// 邮箱验证
const mailbox = (val: any) => {
  if (val) {
    const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return reg.test(val);
  } else {
    return true;
  }
};
</script>

<style lang="scss" scoped></style>
