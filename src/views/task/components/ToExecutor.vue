<template>
  <a-popconfirm title="送执行方审批?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onOk">
    <a-button class="verify-pass-btn"
              type="primary"
              size="small">执行方审批
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
  const res = await post(APIUri.Task.toExecutor, {task_id: props.taskId})
  if(res.data.code === 0){
    notify({type: 'success', text: res.data.msg})
    emit("on-callback")
  }
}

</script>

<style scoped>
.verify-pass-btn {
  margin-right: 10px;
  background-color: #eb0dc0;
  border-color: #eb0dc0
}

.verify-pass-btn:hover {
  background-color: rgba(247, 39, 206, 0.87);
  border-color: rgba(247, 39, 206, 0.87)
}
</style>
