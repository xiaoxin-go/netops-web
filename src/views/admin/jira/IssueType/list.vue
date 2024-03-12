<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList"
      :form-options='formColumns'>
  </VARest>
</template>
<script lang='ts' setup>
import { APIUri } from "@/api";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.IssueType.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "JIRA配置"},
  {label: "工单环境"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  { title: "关联区域", dataIndex: "region"},
  { title: "工单属地", dataIndex: "jira_region", slot: "edit" },
  { title: "工单环境", dataIndex: "jira_environment" },
  { title: "描述", dataIndex: "description" },
  { title: "更新时间", dataIndex: "updated_at" },
  {
    title: "是否启用", dataIndex: "enabled", tagType: "tag", width: 90,
    options: {
      colors: {1: 'green', 0: 'red'},
      labels: {1: '是', 0: '否'}
    }
  },
  { title: "操作", dataIndex: "action", slot: "action" }
]
const formColumns: Array<VAFormItem> = [
  {
    label: "网络区域",
    key: "region_id",
    tagType: 'select',
    required: true,
    options: {
      uri: APIUri.Region.restful.list,
      label: "name",
      value: "id"
    }
  },
  { label: "工单属地", key: "jira_region", required: true },
  { label: "工单环境", key: "jira_environment", required: true },
  { label: "描述", key: "description", required: true },
  {
    label: '是否启用', key: 'enabled', tagType: 'radio-group', required: true, default: 1,
    options: [{label: "是", value: 1}, {label: "否", value: 0}]
  },
]
</script>
