<!--  -->
<template>
   <div class="time-item">
        <el-input v-model="input" placeholder="天" />
        <span>天</span>
        <el-input v-model="input" placeholder="时" />
        <span>时</span>
        <el-input v-model="input" placeholder="分" />
        <span>分</span>
   </div>
</template>

<script lang='ts' setup>

</script>
<style lang='scss'>
    .time-item{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
            margin: 0 10px;
        }
    }
</style>