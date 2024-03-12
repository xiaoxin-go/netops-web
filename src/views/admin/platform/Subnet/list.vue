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

const uris = new Auth().useRestfulUris(APIUri.Subnet.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "平台配置"},
  {label: "网段管理"},
]

const searches: Array<VASearchItem> = [
  {field: 'region', tagType: 'select', isSearch: true, placeholder: '请选择区域',
    options: [
      {label: '外网', value: '外网'},
      {label: '上海', value: '上海'},
      {label: '上海沙箱', value: '上海沙箱'},
      {label: '南京', value: '南京'},
      {label: '芜湖', value: '芜湖'},
    ]},
  {field: 'subnet__contains', placeholder: '请输入网段', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  {title: "区域", dataIndex: "region"},
  {title: "IP地址", dataIndex: "subnet",  slot: "edit"},
  {title: "网络类型", dataIndex: "net_type"},
  {title: "IP地址类型", dataIndex: "ip_type"},
  {title: "描述信息", dataIndex: "description"},
  {title: "UpdatedAt", dataIndex: "updated_at"},
  {title: "操作", dataIndex: "action", slot: "action"}
]
const formColumns: Array<VAFormItem> = [
  {label: "IP地址", key: "subnet", required: true},
  {label: "区域", key: "region", required: true, tagType: 'select',
    options: [
      {label: '外网', value: '外网'},
      {label: '上海', value: '上海'},
      {label: '上海沙箱', value: '上海沙箱'},
      {label: '南京', value: '南京'},
      {label: '芜湖', value: '芜湖'},
      {label: '贵州', value: '贵州'},
    ]
  },
  {
    label: "网络类型", key: "net_type", required: true, tagType: 'select',
    options: [
        {label: '内网', value: '内网'},
        {label: '公网', value: '公网'},
        {label: '外部', value: '外部'},
        {label: 'CN2-1124', value: 'CN2-1124'},
        {label: 'CN2-PI-1', value: 'CN2-PI-1'},
        {label: 'DCN', value: 'DCN'},
      ]
  },
  {
    label: "IP地址类型", key: "ip_type", required: true, tagType: 'radio-group', default: 'ipv4',
    options: [{label: 'ipv4', value: 'ipv4'}, {label: 'ipv6', value: 'ipv6'}]
  },
  {label: "描述信息", key: "description"}
]
</script>
