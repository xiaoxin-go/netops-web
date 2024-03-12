<template>
  <a-popconfirm ok-text="确定"
                cancel-text="取消"
                @confirm="onOk">
    <template #title>
      <span style="display: block">确定驳回工单?</span>
      <div>
        <a-input v-model:value="rejectContent" placeholder="请输入驳回理由" size="small"></a-input>
      </div>
    </template>
    <a-button type="primary" danger size="small">驳回
    </a-button>
  </a-popconfirm>
</template>

<script setup lang="ts">

import {defineEmits, defineProps, ref} from "vue";
import {APIUri, post} from "@/api";
import {notify} from "@kyvg/vue3-notification";

const props = defineProps({
  taskId: Number,
})

const emit = defineEmits(['on-callback'])
const rejectContent = ref("")

const onOk = async() =>{
  const res = await post(APIUri.Task.reject, {task_id: props.taskId, content: rejectContent.value})
  if(res.data.code === 0){
    notify({type: 'success', text: res.data.msg})
    emit("on-callback")
  }
}

</script>

<style scoped>

</style>
