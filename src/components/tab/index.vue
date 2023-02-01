<!--  -->
<template>
    <div class="tab-container">
        <span 
            v-for="(item,index) in tabs" 
            :key="index"
            @click="handleClick(item)"
            :class="tabValue == item.value ? 'active' : ''"
        >
            {{item.label}}
        </span>
    </div>
</template>

<script lang='ts' setup>
    import { useStore } from 'vuex'

    const props = defineProps({
        tabs:{
            type:Array,
            default(){
                return []
            }
        },
        tabValue:{
            type:Number,
            default(){
                return -1
            }
        }
    })
    
    const emit = defineEmits(["change"])
        
    const store = useStore()

    const handleClick = (item:object)=>{
        emit("change",item)
    }

</script>
<style lang='scss' scoped>
    .tab-container{
        margin:0 20px;
        // padding:10px;
        // width: 100%;
        display: flex;
        border-bottom: solid 1px #ddd;
        span{
            border:solid 1px #ddd;
            border-bottom: none;
            padding:0 20px;
            line-height: 30px;
            border-radius: 5px 5px 0 0;
            cursor: pointer;
        }
        .active{
            background-color: var(--system-primary-color);
            border-color: var(--system-primary-color);
            color: #fff;
        }
    }
</style>