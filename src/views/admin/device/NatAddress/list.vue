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

const uris = new Auth().useRestfulUris(APIUri.NatAddress.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "防火墙nat映射管理"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'region_id', placeholder: '请选择区域', tagType: 'select', width: '140px',
    options: {
      uri: APIUri.Region.restful.list,
      label: 'name',
      value: 'id'
    },
    isSearch: true
  },
  {field: 'name__contains', placeholder: '请输入名称'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '属地', dataIndex: 'region'},
  {title: '设备', dataIndex: 'device_name'},
  {title: '映射名称', dataIndex: 'static_name', slot: 'edit'},
  {title: '匹配网段', dataIndex: 'subnet'},
  {title: '出向网络类型', dataIndex: 'outbound_network_type'},
  {title: 'Nat策略名', dataIndex: 'nat_name'},
  {title: '操作', dataIndex: 'action', slot: 'action'}
]
const formColumns: Array<VAFormItem> = [
  {
    label: '网络设备', key: 'device_id', tagType: 'select-cascade', required: true,
    width: '130px',
    placeholder: '选择区域',
    options: {
      uri: APIUri.Region.restful.list,
      label: 'name', value: 'id',
      child: {
        params: {
          field: 'region_id',
          type: 'query',
        },
        placeholder: '选择设备',
        width: '130px',
        paramsType: 'query',
        uri: APIUri.Device.restful.list,
        label: "name",
        value: "id",
      },
    }
  },
  {label: '映射名称', key: 'static_name', required: true, placeholder: '映射的pool名称或者nat地址名'},
  {label: '匹配网段', key: 'subnet', required: true, placeholder: '对应出向源IP网段, 可为多个以逗号分割'},
  {label: 'Nat策略名', key: 'nat_name', required: true, placeholder: 'nat策略名称'},
  {label: '出向网络类型', key: 'outbound_network_type', placeholder: '映射的pool名称或者nat地址名',
    tagType: 'select',
    options: [
      {label: 'CN2-1124', value: 'CN2-1124'},
      {label: 'CN2-PI-1', value: 'CN2-PI-1'},
      {label: 'DCN', value: 'DCN'},
    ]
  },
]
</script>
