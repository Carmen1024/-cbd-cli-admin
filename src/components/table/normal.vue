<!-- 表格-基础模板 -->
<template>
  <div class="layout-container-table">
    <Table
      ref="table"
      v-model:page="page"
      v-loading="loading"
      :showIndex="showIndex"
      :showSelection="showSelection"
      :data="tableData"
      @getTableData="getTableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="(item, index) in columnArr"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
      >
        <template #default="scope" v-if="item.type == 'handle'">
          <el-switch
            v-model="scope.row[item.prop]"
            @change="tableHandle('valid', scope.row)"
            :disabled="scope.row.disabled"
          />
        </template>
        <template #default="scope" v-if="item.type == 'inputNumber'">
          <el-input-number
            type="number"
            v-model="scope.row[item.prop]"
            :min="item.min || 0"
            :max="item.max || Infinity"
            controls-position="right"
            :placeholder="item.placeholder || ''"
            :precision="item.precision || 0"
            @change="changeNumber(scope.row, item.prop)"
          />
        </template>
        <template #default="scope" v-if="item.type == 'formatter'">
          <span v-html="item.formatter(scope.row[item.prop], scope.row)"></span>
        </template>
        <template #default="scope" v-if="item.type == 'input'">
          <el-input
            v-model="scope.row[item.prop]"
            placeholder="无限制"
            type="number"
            min="0"
            @change="changeInput(scope.row, item.prop)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.common.handle')"
        :align="handleAlign || 'center'"
        fixed="right"
        :width="handles.length * 100"
      >
        <template #default="scope">
          <span
            v-for="(handle, index) in handles"
            :key="index"
            class="handle-span"
          >
            <el-button
              v-if="handle.value == 'edit'"
              @click="handleEdit(scope.row)"
            >
              <!-- {{ handle.label || "编辑" }} -->
              {{ `${scope.row.disabled ? "查看" : handle.label || "编辑"}` }}
            </el-button>
            <el-popconfirm
              v-else-if="handle.value == 'delete'"
              :title="$t('message.common.delTip')"
              @confirm="handleDel(scope.row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :disabled="handle.disabled || scope.row.disabled"
                  >{{ handle.label || $t("message.common.del") }}</el-button
                >
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-else-if="handle.value == 'invalid'"
              :title="$t('message.common.TvoidTip')"
              @confirm="handleDel(scope.row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :disabled="handle.disabled || scope.row.disabled"
                  >{{ handle.label }}</el-button
                >
              </template>
            </el-popconfirm>
            <span v-else-if="handle.value == 'preSale'">
              <el-button
                v-if="scope.row.showSale"
                @click="preSaleHandle(scope.row)"
                type="primary"
              >
                {{ handle.label }}
              </el-button>
            </span>
            <span v-else-if="handle.value == 'preDelete'">
              <el-button @click="handleDel(scope.row)" type="danger">
                {{ handle.label }}
              </el-button>
            </span>
            <!-- 其他的 -->
            <template v-else>
              <template v-if="handle.condition" >
                <el-button
                  v-if="handle.condition.containValue.includes(scope.row[handle.condition.prop])"
                  @click="tableHandle(handle.value, scope.row)"
                  :type="handle.btnType || 'primary'"
                >
                {{ handle.label }}
                </el-button>
              </template>
              <el-button
                v-else
                @click="tableHandle(handle.value, scope.row)"
                :type="handle.btnType || 'primary'"
              >
                {{ handle.label }}
              </el-button>
            </template>
          </span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from "vue";
  import Table from "@/components/table/index.vue";
  import { ElMessage } from "element-plus";

  const props = defineProps({
    columnArr: {
      type: Array,
      default() {
        return [];
      },
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    page: {
      type: Object,
      default() {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default() {
        return true;
      },
    },
    showIndex: {
      type: Boolean,
      default() {
        return true;
      },
    },
    showSelection: {
      type: Boolean,
      default() {
        return false;
      },
    },
    handles: {
      type: Array,
      default() {
        return [
          { value: "edit", label: "编辑" },
          { value: "delete", label: "删除" },
        ];
      },
    },
    handleAlign:{
      type: String,
      default() {
        return "center";
      },
    }
  });
  const emit = defineEmits([
    "preSaleHandle",
    "getTableData",
    "handleSelectionChange",
    "handleEdit",
    "handleDel",
    "tableHandle",
    "handleNumber",
  ]);
  // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
  const getTableData = (val: any) => {
    emit("getTableData", val);
  };
  const handleSelectionChange = (val: any) => {
    emit("handleSelectionChange", val);
  };
  const handleEdit = (row: object) => {
    emit("handleEdit", row);
  };
  const handleDel = (row: object) => {
    emit("handleDel", row);
  };
  const tableHandle = (type: String, row: object) => {
    emit("tableHandle", { type, row });
  };
  const preSaleHandle = (row: object) => {
    emit("preSaleHandle", row);
  };
  const changeNumber = (row: object, prop: String) => {
    const reg = /^[+]{0,1}(\d+)$/g;
    if (prop !== "presellUpperLimit") {
      if (!reg.test(row[prop])) {
        ElMessage({
          message: "请填写数字",
          type: "error",
          duration: 3000,
        });
        return;
      }
    }
    tableHandle("level", row);
  };
  const changeInput = (row: object, prop: String) => {
    if (row[prop] == "") {
      row[prop] = "无限制";
    }
    if (row[prop].length > 9) {
      row[prop] = row[prop].slice(0, 9);
    }
  };
</script>
<style lang="scss" scoped>
  .handle-span + .handle-span {
    padding-left: 10px;
  }
</style>
