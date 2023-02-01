<!--  -->
<template>
    <el-pagination
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
        <span class="el-pagination__total">共 {{page.total}} 条</span>
    </el-pagination>
</template>

<script lang='ts' setup>
    import { defineComponent,ref,reactive } from 'vue'
    import { useStore } from 'vuex'
    
    const store = useStore()

    const props = defineProps({
        page: { // 分页参数
            type: Object,
            default: () => {
                return { index: 1, size: 20, total: 0 }
            }
        },
        // 分页需要显示的东西，默认全部
        pageLayout: { 
            type: String, 
            default: "slot, sizes, prev, pager, next, jumper" 
        }, 
        pageSizes: { 
            type: Array, 
            default: [10, 20, 50, 100] 
        }
    })

    let timer: any = null
    const emit = defineEmits(["getTableData"])
    // 分页相关：监听页码切换事件
    const handleCurrentChange = (val: Number) => {
        if (timer) {
            props.page.index = 1
        } else {
            props.page.index = val
            emit("getTableData")
        }
    }
    // 分页相关：监听单页显示数量切换事件
    const handleSizeChange = (val: Number) => {
        timer = 'work'
        setTimeout(() => {
        timer = null
        }, 100)
        props.page.size = val
        emit("getTableData", true)
    }
  
</script>
<style lang='scss' scoped>
 
</style>