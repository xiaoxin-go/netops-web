<template>
  <a-popconfirm title="确定生成策略?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onOk">
    <a-button class="gene-config-btn"
              type="primary"
              size="small">生成配置
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
  const res = await post(APIUri.Task.geneConfig, {task_id: props.taskId})
  if(res.data.code === 0){
    notify({type: 'success', text: res.data.msg})
    emit("on-callback")
  }
}

</script>

<style scoped>
.gene-config-btn {
  margin-right: 10px;
  background-color: #cf5bfc;
  border-color: #cf5bfc
}

.gene-config-btn:hover {
  background-color: #d476f8;
  border-color: #d476f8
}
</style>
