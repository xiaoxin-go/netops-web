<template>
  <div class="main">
    <div>
      <VABreadcrumb :options="breadcrumbList"></VABreadcrumb>
    </div>
    <div class="main-body">
      <VADescriptions title="工单配置信息"
                    :column="4"
                    :options="data.descriptionOptions"
                    :data="data.taskData">
        <template #extra>
          <a-popconfirm title="确定执行工单?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="exec">
            <a-button v-if="isExec"
                      type="danger"
                      size="small">执行工单</a-button>
          </a-popconfirm>
        </template>
      </VADescriptions>
      <div>
        <h3 style="display: inline-block; margin-top: 10px">配置详情</h3>
      </div>
      <div style="flex: 1; overflow-y: auto">
        <a-card v-for="item in data.taskInfoList"
                :key="item.id"
                size="small">
          <template #title>
            <a-tag :color="directions[item.direction].color">{{directions[item.direction].label}}</a-tag>
            {{item.src}} -> {{item.dst}}:{{item.dport}} {{item.device.name}}
            <a-tag   v-if='item.action'  :color="actions[item.action].color">{{actions[item.action].label}}</a-tag>
          </template>
          <Command :command="item.command"></Command>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { Task, TaskInfo } from "@/interface/task";
import { useRoute } from "vue-router";
import { APIUri, list, get, create } from "@/api";
import {
  directions,
  actions,
  jiraStatusColors,
  execStatusColors
} from "../common";
import Command from "@/components/Command.vue";
import { isOperate } from "../service";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {notify} from "@kyvg/vue3-notification";

const route = useRoute();

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "工单任务", name: "TaskFirewall"},
  {label: "工单详情", name: "TaskFirewallDetail", query: route.query},
  {label: "工单配置"},
]

onMounted(() => {
  if (!route.query.task_id) {
    notify({type: 'error', text: '任务ID不能为空'})
    return;
  }
  data.taskId = parseInt(route.query.task_id.toString());
  getTask();
  getTaskInfoList();
});


const data = reactive({
  taskId: 0,
  descriptionOptions: [
    { label: "工单号", key: "jira_key" },
    { label: "属地", key: "jira_region" },
    { label: "环境", key: "jira_environment" },
    { label: "策略类型", key: "implement_type" },
    { label: "创建人", key: "creator" },
    {
      label: "工单状态",
      key: "jira_status",
      type: "tag",
      colors: jiraStatusColors
    },
    { label: "任务状态", key: "status", type: "tag", colors: execStatusColors },
    { label: "描述", key: "summary" }
  ],
  taskData: {} as Task,
  taskInfoList: [] as TaskInfo[]
});

const { isExec } = isOperate(data.taskData.id);

const exec = async () => {
  const res = await create(APIUri.Task.exec, { task_id: data.taskId });
  if (res.data.code === 0) {
    notify({type: 'success', text: res.data.msg})
  }
  return;
};

const getTask = async () => {
  const res = await get(APIUri.Task.restful.get, data.taskId);
  if (res.data.code === 0) {
    data.taskData = res.data.data;
  }
};

const getTaskInfoList = async () => {
  const res = await list(APIUri.Task.info.restful.list, { task_id: data.taskId});
  if (res.data.code === 0) {
    data.taskInfoList = res.data.data;
  }
};
</script>

<style scoped>
</style>
