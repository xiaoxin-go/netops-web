<template>
  <a-popconfirm title="确定执行工单?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onOk">
    <a-button class="exec-btn"
              type="primary"
              size="small">执行工单
    </a-button>
  </a-popconfirm>
</template>

<script setup lang="ts">

import {defineEmits, defineProps} from "vue";
import {APIUri, post} from "@/api";
import {notify} from "@kyvg/vue3-notification";

const props = defineProps({
  taskId: Number,
})

const emit = defineEmits(['on-callback'])

const onOk = async() =>{
  const res = await post(APIUri.Task.exec, {task_id: props.taskId})
  if(res.data.code === 0){
    notify({type: 'success', text: res.data.msg})
    emit("on-callback")
  }
}

</script>

<style scoped>
.exec-btn{
  margin-right: 10px;
  color: #fff;
  background: #87d068;
  border-color: #87d068;
}
.exec-btn:hover{
  opacity: 0.87;
  background: #87d068;
  border-color: #87d068;
}
</style>
