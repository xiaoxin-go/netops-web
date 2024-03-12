<template>
  <VATable ref="info"
           :uri="APIUri.Task.info.restful.list"
           :default-params="tableParams()"
           :columns="tableColumns">
    <template #tableNode="{record}">
      <a-popover placement="right" style="max-height: 800px;overflow-y: auto">
        <template #content>
          <p v-for="item in record.node.split(',')"
             :key="item">{{ item }}</p>
        </template>
        <div style="width: 120px; overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
          {{ record.node }}
        </div>
      </a-popover>
    </template>
    <template #dstTable="{record}">
      <a-tooltip placement="right"
                 overlayClassName="policy-command">
        <template #title>
          <NlbCommand :value="parseCommand(record)"></NlbCommand>
        </template>
        <a v-html="record.dst.replace(/,/g, '<br/>')"></a>
      </a-tooltip>
    </template>
    <template #dportTable="{record}">
      <span v-html="record.dport.replace(/,/g, '<br/>')"></span>
    </template>
    <template #actionTable="{record}">
      <VAPopconfirm v-if="isEdit"
                    title="删除策略"
                    label="删除"
                    labelColor="#DC143C"
                    placeholder="确定删除吗？"
                    @on-ok="delTaskInfo(record.id)">
      </VAPopconfirm>
    </template>
  </VATable>
</template>

<script setup lang="ts">
import {defineProps, ref, Ref} from "vue";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {execStatusColors, taskStatus} from "@/views/task/common";
import {APIUri, del} from "@/api";
import NlbCommand from "../components/NlbCommand.vue"

const props = defineProps({
  taskId: Number,
  isEdit: Boolean,
})
const tableParams = () => {
  if (props.taskId)
    return {task_id: props.taskId}
}

const parseCommand = (record: any): string => {
  return JSON.stringify({vs: JSON.parse(record.vs_command), pool: JSON.parse(record.pool_command)}, null, 2)
}

const info: Ref = ref({})

const reload = () =>{
  info.value.reload(tableParams())
}

const tableColumns: Array<VATableColumn> = [
  {title: "目标IP", dataIndex: "dst", slot: "dstTable"},
  {title: "目标端口", dataIndex: "dport", slot: "dportTable"},
  {title: "协议", dataIndex: "protocol"},
  {title: "Node", dataIndex: "node", slot: 'tableNode'},
  {title: "NodePort", dataIndex: "node_port"},
  {title: "SNat", dataIndex: "s_nat"},
  {
    title: "配置信息", dataIndex: "action", tagType: "tag", options: {
      colors: {permit: "blue", deny: "green"},
      labels: {permit: "已有配置", deny: "新增配置"}
    }
  },
  {
    title: "执行状态", dataIndex: "status", tagType: "tag", options: {
      colors: execStatusColors,
      labels: taskStatus
    }
  },
  {title: "操作", dataIndex: "action", slot: "actionTable"}
]

const delTaskInfo = (id: number) => {
  del(APIUri.Task.info.restful.delete, id).then(reload);
};
</script>

<style scoped>
.policy-command {
  max-width: 900px !important;
}
</style>
