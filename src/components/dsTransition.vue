<template>
    <transition 
        :name="areaName" mode="out-in"
        :enter-active-class="enterClass"
        :leave-active-class="leaveClass"
        :duration="{enter:enterTime,leave:leaveTime}"
    >
        <slot></slot>
    </transition>
</template>
<script>
export default {
    name:'dstransition',
    props:{
        areaName:{
            type:String
        },
        enterClass:{
            type:String,
            default:'animated fadeIn'
        },
        leaveClass:{
            type:String,
            default:'animated slideOutRight'
        },
        enterTime:{
            default:'200'
        },
        leaveTime:{
            default:'200'
        }
    },
    data(){
        return {
            enterTime2:parseInt(this.enterTime),
            leaveTime2:parseInt(this.leaveTime)
        };
    }
};
</script>
<style>
</style>

