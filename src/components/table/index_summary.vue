<template>
    <div class="system-table-box">
        <el-table
            v-bind="$attrs"
            ref="table"
            class="system-table"
            border
            row-key="id"
            :data="data"
            :show-summary="showSummary"
            :summary-method="summaryMethod"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                align="center"
                width="50"
                :selectable="handleSelectTable"
                v-if="showSelection"
            />
            <el-table-column
                label="序号"
                width="60"
                align="center"
                v-if="showIndex"
            >
                <template #default="scope">
                    {{ (page.index - 1) * page.size + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column
                v-for="(item, index) in columnData"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                align="center"
            />
            <slot></slot>
        </el-table>
        <el-pagination
            v-if="showPage"
            v-model:current-page="page.index"
            class="system-page"
            background
            :layout="pageLayout"
            :total="page.total"
            :page-size="page.size"
            :page-sizes="pageSizes"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
            <span class="el-pagination__total">共 {{ page.total }} 条</span>
        </el-pagination>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    ref,
    onActivated,
    onMounted,
    watch,
} from "vue";
import { Page } from "@/components/table/type";
import { log } from "console";
export default defineComponent({
    props: {
        data: { type: Array, default: () => [] }, // 数据源
        select: { type: Array, default: () => [] }, // 已选择的数据，与selection结合使用
        columnData: { type: Array, default: () => [] }, // 表格表头数据，与columnData结合使用
        showIndex: { type: Boolean, default: false }, // 是否展示index选择，默认否
        showSelection: { type: Boolean, default: false }, // 是否展示选择框，默认否
        showPage: { type: Boolean, default: true }, // 是否展示页级组件，默认是
        showSummary: { type: Boolean, default: false }, // 是否展示表格合计行 默认 否
        summaryMethod: { type: Function, default: () => {} }, //合计规则
        page: {
            // 分页参数
            type: Object,
            default: () => {
                return { index: 1, size: 20, total: 0 };
            },
        },
        // 分页需要显示的东西，默认全部
        pageLayout: {
            type: String,
            default: "slot, sizes, prev, pager, next, jumper",
        },
        pageSizes: { type: Array, default: [10, 20, 50, 100] },
    },
    setup(props, context) {
        const table: any = ref(null);
        let timer: any = null;
        console.log(11);
        // 监听数据的变化
        watch(
            props.page,
            (newVal) => {
                console.log(newVal);
            },
            { deep: true }
        );
        // 分页相关：监听页码切换事件
        const handleCurrentChange = (val: Number) => {
            if (timer) {
                props.page.index = 1;
            } else {
                props.page.index = val;
                context.emit("getTableData");
            }
        };
        // 分页相关：监听单页显示数量切换事件
        const handleSizeChange = (val: Number) => {
            timer = "work";
            setTimeout(() => {
                timer = null;
            }, 100);
            props.page.size = val;
            context.emit("getTableData", true);
        };
        // 选择监听器
        const handleSelectionChange = (val: []) => {
            context.emit("selection-change", val);
        };
        // 解决BUG：keep-alive组件使用时，表格浮层高度不对的问题
        onActivated(() => {
            table.value.doLayout();
        });
        const handleSelectTable = (row, index) => {
            if (row.turn_down_flag == "已驳回") {
                return false;
            }
            if (row.o_m_type == 1 || row.o_m_type == 3) {
                return true;
            } else {
                return false;
            }
        };
        return {
            table,
            handleCurrentChange,
            handleSizeChange,
            handleSelectionChange,
            handleSelectTable,
        };
    },
});
</script>

<style lang="scss" scoped>
.system-table-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .system-table {
        flex: 1;
        // height: 100%;
        min-height: 300px;
    }

    .system-page {
        margin-top: 20px;
    }
}
</style>