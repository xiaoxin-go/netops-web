<template>
  <VATable ref="info"
           :uri="APIUri.Task.info.restful.list"
           :default-params="tableParams()"
           :columns="tableColumns">
    <template #srcTable="{record}">
      <a-tooltip placement="right"
                 overlayClassName="policy-command">
        <template #title>
          <div style="overflow-y: auto; max-height: 700px;">
            <Command :command="record.command" ></Command>
            <Command v-if="record.exists_config !== ''" :command="'已有配置: ' + record.exists_config"></Command>
          </div>
        </template>
        <a class="item-src" v-html="record.src.replace(/,/g, '<br/>')"></a>
      </a-tooltip>
    </template>
    <template #dstTable="{record}">
          <span v-if="record.static_ip !== ''">
            {{ record.static_ip }}->{{ record.dst }}
          </span>
      <span class="item-src" v-else
            v-html="record.dst.replace(/,/g, '<br/>')">
          </span>
    </template>
    <template #dportTable="{record}">
          <span v-if="record.static_port !== ''">
            {{ record.static_port }}->{{ record.dport }}
          </span>
      <span v-else
            v-html="record.dport.replace(/,/g, '<br/>')"></span>
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
import Command from "@/components/Command.vue";

const props = defineProps({
  taskId: Number,
  isEdit: Boolean,
})
const tableParams = () => {
  if (props.taskId)
    return {task_id: props.taskId}
}

const info: Ref = ref({})

const reload = () =>{
  info.value.reload(tableParams())
}

const tableColumns: Array<VATableColumn> = [
  {
    title: "方向", dataIndex: "direction", tagType: "tag", options: {
      colors: {inside: "green", outside: "blue"},
      labels: {inside: "入向", outside: "出向"}
    }
  },
  {title: "源IP", dataIndex: "src", slot: "srcTable"},
  {title: "目标IP", dataIndex: "dst", slot: "dstTable"},
  {title: "目标端口", dataIndex: "dport", slot: "dportTable"},
  {title: "协议", dataIndex: "protocol"},
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

</style>
