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
import {VABreadcrumbItem} from "../../../../../modules/components/VABreadcrumb/typings";
import {VASearchItem} from "../../../../../modules/components/VASearch/typings";
import {VATableColumn} from "../../../../../modules/components/VATable/extends/typing";
import {VAFormItem} from "../../../../../modules/components/VAForm/extends/typing";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.Region.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "平台配置"},
  {label: "区域管理"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  { title: "网络区域名称", dataIndex: "name", slot: "edit" },
  { title: "后端地址", dataIndex: "api_server" },
  { title: "描述", dataIndex: "description" },
  {
    title: "是否启用", dataIndex: "enabled", tagType: "tag", width: 90,
    options: {
      colors: {1: 'green', 0: 'red'},
      labels: {1: '是', 0: '否'}
    }
  },
  { title: "更新时间", dataIndex: "updated_at" },
  { title: "操作", dataIndex: "action", slot: "action" }
]
const formColumns: Array<VAFormItem> = [
  { label: "网络区域名称", key: "name", required: true , update: false},
  {
    label: "工单模板",
    key: "task_template_id",
    tagType: "select",
    required: true,
    options: {
      uri: APIUri.TaskTemplate.restful.list,
      label: "name",
      value: "id"
    }
  },
  { label: "后端地址", key: "api_server", required: true },
  {
    label: "是否启用",
    key: "enabled",
    tagType: "radio-group",
    required: true,
    default: 1,
    options: [
      { label: "是", value: 1 },
      { label: "否", value: 0 }
    ]
  },
  { label: "Description", key: "description", required: true },
]
</script>
