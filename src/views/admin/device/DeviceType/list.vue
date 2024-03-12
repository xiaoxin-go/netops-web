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
import {APIUri} from "@/api";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.DeviceType.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "防火墙类型管理"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '设备类型', dataIndex: 'type', tagType: 'tag', options: {
    labels: {firewall: '防火墙', nlb: '负载均衡'},
    colors: {firewall: 'blue', nlb: 'green'},
    }},
  {title: '设备类型名称', dataIndex: 'name'},
  {title: 'Description', dataIndex: 'description'},
  {title: '更新时间', dataIndex: 'updated_at'},
  {title: '操作', dataIndex: 'action', slot: 'action'}]

const formColumns: Array<VAFormItem> = [
  {label: '设备类型', key: 'type', tagType: 'select', required: true, options: [
      {label: '防火墙', value: 'firewall'},
      {label: '负载均衡', value: 'nlb'},
    ]},
  {label: '设备类型名称', key: 'name', required: true},
  {label: 'Description', key: 'description', required: true},
]
</script>
