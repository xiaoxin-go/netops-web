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

const uris = new Auth().useRestfulUris(APIUri.ImplementType.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "JIRA配置"},
  {label: "工单实施类型"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  { title: "实施类型名称", dataIndex: "name", slot: "edit" },
  { title: "描述信息", dataIndex: "description" },
  { title: "UpdatedAt", dataIndex: "updated_at" },
  { title: "操作", dataIndex: "action", slot: "action" }
]
const formColumns: Array<VAFormItem> = [
  { label: "实施类型名称", key: "name", required: true },
  { label: "描述信息", key: "description", required: true }
]
</script>
