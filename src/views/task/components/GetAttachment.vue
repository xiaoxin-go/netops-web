<template>
  <a-popconfirm title="读取附件?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onOk">
    <a-button style="margin-right: 10px" type="primary"
              size="small">读取附件
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
  const res = await post(APIUri.Task.addInfos, {task_id: props.taskId})
  if(res.data.code === 0){
    notify({type: 'success', text: res.data.msg})
    emit("on-callback")
  }
}

</script>

<style scoped>
</style>
