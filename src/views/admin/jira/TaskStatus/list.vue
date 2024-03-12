<template>
  <VARest v-if="uris.list"
          :uris="uris"
          :search-options="searches"
          :table-columns="tableColumns"
          :breadcrumb-options="breadcrumbList"
          :form-options='formColumns'>
    <template #taskStatus="{record}">
      <a-tag v-for="item in JSON.parse(record.task_status)" :color="execStatusColors[item]" :key="item">{{execStatusCn[item]}}</a-tag>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from "@/api";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {execStatusCn, execStatusColors, jiraStatusColors} from "@/views/task/common";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.TaskStatus.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "JIRA配置"},
  {label: "任务状态"},
]

const searches: Array<VASearchItem> = [
  {field: 'operate__contains', placeholder: '请输入操作', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  {title: "操作名称", dataIndex: "operate", slot: "edit"},
  {title: "对应任务状态", dataIndex: "task_status", slot: 'taskStatus'},
  {title: "对应JIRA状态", dataIndex: "jira_status"},
  {title: "下一个任务状态", dataIndex: "task_next_status", tagType: "tag", options: {colors: execStatusColors,labels: execStatusCn}},
  {
    title: "下一个JIRA状态",
    dataIndex: "jira_next_status",
    tagType: "tag", options: {colors: jiraStatusColors}
  },
  {title: "经办人", dataIndex: "assignee"},
  {title: "更新时间", dataIndex: "updated_at"},
  {title: "操作", dataIndex: "action", slot: "action"}
]
const taskStatus = [
  {label: "初始化", value: "init"},
  {label: "配置生成成功", value: "ready"},
  {label: "审核通过", value: "review"},
  {label: "执行失败", value: "failed"},
  {label: "执行成功", value: "success"},
  {label: "驳回", value: "reject"},
]
const formColumns: Array<VAFormItem> = [
  {label: "操作名称", key: "operate", required: true, update: false},
  {label: "任务状态", key: "task_status", required: true, tagType: "select",
    options: {
      data: taskStatus,
      mode: "multiple",
      multipleValueType: "string"
    },
    placeholder: "当前可操作的任务状态，可多个以逗号分割"},
  {label: "JIRA流程", key: "jira_status", required: true, placeholder: "当前可操作的工单流程，可多个以逗号分割"},
  {
    label: "下一个任务状态", key: "task_next_status", tagType: "select",
    options: taskStatus, placeholder: "请选择操作后的任务状态"
  },
  {
    label: "JIRA下个流程状态",
    key: "jira_next_status",
    placeholder: "JIRA下个流程状态，可多个，以&分割并行以|分割",
  },
  {label: "经办人", key: "assignee", placeholder: "要分配的经办人"},
]
</script>
