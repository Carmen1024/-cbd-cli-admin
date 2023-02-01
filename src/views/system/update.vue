<template>
    <div class="container">
        <img class="updateImg" :src="updateImg" alt="update" />
        <div class="updateTips">
            <p class="t1">系统正在升级中</p>
            <p class="t2">如有疑问,请联系管理员</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { defineComponent } from "vue";
    import updateImg from "@/assets/images/update.png";
    import { useRouter } from "vue-router";

    const router = useRouter();
    
    function go() {
        router.push("/");
    }
</script>

<style lang="scss" scoped>
.el-aside.show-side {
    display: none;
}
.el-header {
    display: none;
}
.tabs {
    display: none !important;
}
.container {
    background-color: #fff;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.updateImg {
    width: 300px;
    height: 300px;
}
.updateTips .t1 {
    font-size: 32px;
    font-weight: bold;
    line-height: 32px;
    text-align: center;
    margin-left: 50px;
}
.updateTips .t2 {
    font-weight: bold;
	color: gray;
    text-align: center;
    margin-left: 50px;
}
</style>