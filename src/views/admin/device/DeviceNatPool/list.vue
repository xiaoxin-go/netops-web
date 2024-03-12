<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList">
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from "@/api";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.DeviceNatPool.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "Nat Pool"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'device_id', placeholder: '请选择设备', paramsType: 'query', tagType: 'select', options: {
      uri: APIUri.Device.restful.list,
      label: 'name',
      value: 'id'
    }, isSearch: true
  },
  {field: 'name', placeholder: '请输入名称', paramsType: 'query', queryType: 'contains'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '设备', dataIndex: 'device'},
  {title: 'pool名称', dataIndex: 'name'},
  {title: 'pool地址', dataIndex: 'address'},
]
</script>
