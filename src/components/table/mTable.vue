<!-- 表格-基础模板 -->
<template>
  <div class="layout-container-table">
    <Table
      ref="table"
      v-model:page="page"
      v-loading="loading"
      :showIndex="showIndex"
      :showSelection="false"
      :showPage="showPage"
      :data="tableData"
      @getTableData="getTableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="(item, index) in columnArr"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="alignCenter"
        :width="item.width"
      >
        <template #default="scope" v-if="item.type == 'handle'">
          <el-switch
            v-model="scope.row[item.prop]"
            @change="tableHandle('valid', scope.row)"
          />
        </template>
        <template #default="scope" v-if="item.type == 'formatter'">
          <span v-html="item.formatter(scope.row[item.prop], scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isEdit"
        :label="$t('message.common.handle')"
        align="center"
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
              @click="handleEdit(scope.row, scope.$index)"
              :disabled="scope.row.disabled_edit || false"
            >
              {{ handle.label || "编辑" }}
            </el-button>
            <el-popconfirm
              v-else-if="handle.value == 'delete'"
              :title="$t('message.common.delTip')"
              @confirm="handleDel(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button type="danger">{{
                  handle.label || $t("message.common.del")
                }}</el-button>
              </template>
            </el-popconfirm>
            <el-button
              v-else-if="handle.value == 'cancel'"
              @click="tableHandle(handle.value, scope.row)"
              :type="handle.btnType || 'primary'"
              :disabled="scope.row.disabled_order || false"
            >
              {{ handle.label }}
            </el-button>
            <span v-else-if="handle.value == 'cancelSap'">
              <el-button
                v-if="scope.row.show_sap"
                @click="tableHandle(handle.value, scope.row)"
                :type="handle.btnType || 'primary'"
                :disabled="scope.row.disabled_sap || false"
              >
                {{ handle.label }}
              </el-button>
            </span>
            <!-- 其他的 -->
            <el-button
              v-else
              @click="tableHandle(handle.value, scope.row)"
              :type="handle.btnType || 'primary'"
              :disabled="scope.row.disabled || false"
            >
              {{ handle.label }}
            </el-button>
          </span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Table from "@/components/table/index.vue";

export default defineComponent({
  name: "name",
  components: {
    Table,
  },
  props: {
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
    showPage: {
      type: Boolean,
      default() {
        return true;
      },
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      },
    },
    alignCenter: {
      type: String,
      default() {
        return "center";
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
  },
  setup(props, cxt) {
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = (val: any) => {
      cxt.emit("getTableData", val);
    };
    const handleSelectionChange = (val: any) => {
      cxt.emit("handleSelectionChange", val);
    };
    const handleEdit = (row: object, i: number) => {
      cxt.emit("handleEdit", row, i);
    };
    const handleDel = (row: object, i: number) => {
      cxt.emit("handleDel", row, i);
    };
    const tableHandle = (type: String, row: object) => {
      cxt.emit("tableHandle", { type, row });
    };
    return {
      getTableData,
      handleSelectionChange,
      handleEdit,
      handleDel,
      tableHandle,
    };
  },
});
</script>
<style lang="scss" scoped>
.handle-span + .handle-span {
  padding-left: 10px;
}
</style>
