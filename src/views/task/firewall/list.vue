<template>
  <VARest v-if="uris.list"
          :uris="uris"
          :searchOptions="searches"
          :table-columns="tableColumns"
          :breadcrumbOptions="breadcrumbOptions"
          :form-options='formColumns'
          :form-default-params="{type: 'firewall'}"
          :searchDefaultParams="defaultParams"
  >
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from '@/api';
import {execStatusCn, execStatusColors, jiraStatusColors} from "../common";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn, VATableRecord} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {Auth} from "@/auth/common";

// 权限控制
const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Task.restful)

const defaultParams = {
  type: 'firewall',
  is_deleted: 0,
}

const breadcrumbOptions: Array<VABreadcrumbItem> = [
  {label: "任务管理"},
  {label: "防火墙工单"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'region_id', placeholder: '选择属地', tagType: 'select', width: '130px', isSearch: true,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'},
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
  {
    field: 'status__in', placeholder: '任务状态', paramsType: "query", tagType: 'select', width: '130px', isSearch: true,
    options: [
      {label: "待批准", value: "ready,init"},
      {label: "待实施", value: "review"},
      {label: "已实施", value: "success"},
      {label: "实施失败", value: "failed"},
    ],
  },
  {field: 'jira_key__contains', placeholder: '请输入工单号', width: '110px'},
  {field: 'description__contains', placeholder: '请输入标题', width: '130px'},
  {field: 'ip__contains', placeholder: '请输入地址', width: '130px'},
]

const tableColumns: Array<VATableColumn> = [
  {
    title: '工单号', dataIndex: 'jira_key', tagType: 'router',
    options: {name: 'TaskFirewallDetail', key: 'task_id', dataIndex: 'id'}, width: 110
  },
  {
    title: '属地', dataIndex: 'jira_region', width: 130,
    valueFormat: (item: VATableRecord) => {
      return item.jira_region + "-" + item.jira_environment
    }
  },
  {title: '创建人', dataIndex: 'creator', width: 100 },
  {title: '部门', dataIndex: 'department', width: 160, ellipsis: true},
  {title: 'Jira状态', dataIndex: 'jira_status', width: 120, tagType: "tag", options: {colors: jiraStatusColors}},
  {title: '任务状态', dataIndex: 'status', width: 110, tagType: "tag", options: {colors: execStatusColors,labels: execStatusCn}},
  {title: '实施类型', dataIndex: 'implement_type', width: 120, ellipsis: true},
  {title: '更新时间', dataIndex: 'updated_at', width: 150},
  {title: "操作", dataIndex: "action", width: 80, slot: 'action'}
]
const formColumns: Array<VAFormItem> = [
  {label: '工单号', key: 'jira_key', required: true},
]
</script>
