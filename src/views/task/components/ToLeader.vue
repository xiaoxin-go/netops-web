<template>
  <a-popconfirm title="送Leader审核?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onOk">
    <a-button class="to-leader-btn"
              type="primary"
              size="small">送Leader审核
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
  const res = await post(APIUri.Task.toLeader, {task_id: props.taskId})
  if(res.data.code === 0){
    notify({type: 'success', text: res.data.msg})
    emit("on-callback")
  }
}

</script>

<style scoped>
.to-leader-btn {
  margin-right: 10px;
  background-color: #5c68f8;
  border-color: #5c68f8
}

.to-leader-btn:hover {
  background-color: #5c7eff;
  border-color: #5c7eff
}
</style>
