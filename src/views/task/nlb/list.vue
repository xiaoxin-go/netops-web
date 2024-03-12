<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbOptions"
      :form-options='formColumns'
      :form-default-params="{type: 'nlb'}"
      :search-default-params="defaultParams"
  >
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from '@/api';
import {jiraStatusColors} from "../common";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {Auth} from "@/auth/common";

// 权限控制
const uris = new Auth().useRestfulUris(APIUri.Task.restful)

const defaultParams = {
  type: 'nlb', is_deleted: 0
}

const breadcrumbOptions: Array<VABreadcrumbItem> = [
  {label: "任务管理"},
  {label: "负载均衡工单"},
]

const searches: Array<VASearchItem> = [
  {field: 'region_id', placeholder: '选择属地', tagType: 'select', width: '130px', isSearch: true,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'}
  },
  {
    field: 'jira_status__in', placeholder: '工单状态', tagType: 'select', width: '130px', isSearch: true,
    options: [
      {label: "编写方案", value: "编写方案"},
      {label: "网络运维实施", value: "网络运维实施"},
      {label: "安全中心审批", value: "安全中心审批"},
      {label: "验收中", value: "验收中"},
      {label: "驳回", value: "驳回"},
    ],
  },
  {field: 'jira_key__contains', placeholder: '请输入工单号', width: '130px'},
]

const tableColumns: Array<VATableColumn> = [
  {title: '工单号', dataIndex: 'jira_key', tagType: 'router',
    options: {name: 'TaskNlbDetail', key: 'task_id', dataIndex: 'id'}, width: 110
  },
  {title: '属地', dataIndex: 'jira_region', width: 70},
  {title: '环境', dataIndex: 'jira_environment', width: 90},
  {title: '概要', dataIndex: 'summary', ellipsis: true},
  {title: '创建人', dataIndex: 'creator', width: 80},
  {title: '部门', dataIndex: 'department', width: 160, ellipsis: true},
  {title: 'Jira状态', dataIndex: 'jira_status', width: 110, tagType: "tag", options: {colors: jiraStatusColors}},
  {title: '实施类型', dataIndex: 'implement_type', width: 120, ellipsis: true},
  {title: '更新时间', dataIndex: 'updated_at', width: 140},
  {title: "操作", dataIndex: "action", width: 80, slot: 'action'}
]
const formColumns: Array<VAFormItem> = [
  {label: '工单号', key: 'jira_key', required: true},
]
</script>
