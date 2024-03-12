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

const uris = new Auth().useRestfulUris(APIUri.FirewallSubnet.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "防火墙网段管理"},
]

const searches: Array<VASearchItem> = [
  {field: 'device_id', placeholder: '请选择设备', tagType: 'select', isSearch: true, width: '140px',
    options: {
      uri: APIUri.Device.restful.list,
      label: 'name',
      value: 'id'
    }},
]

const tableColumns: Array<VATableColumn> = [
  {title: '内部网段', dataIndex: 'inner_subnet', slot: 'edit'},
  {title: '外部网段', dataIndex: 'outer_subnet'},
  {title: '网络区域', dataIndex: 'region'},
  {title: '实施类型', dataIndex: 'implement_type'},
  {title: '关联设备', dataIndex: 'device'},
  {title: '描述信息', dataIndex: 'description'},
  {title: '更新时间', dataIndex: 'updated_at'},
  {title: '操作', dataIndex: 'action', slot: 'action'}]
const formColumns: Array<VAFormItem> = [
  {label: '内部网段', key: 'inner_subnet', required: true, placeholder: '内部网段，用于判断出向内网地址，源IP, 可多个地址'},
  {label: '外部网段', key: 'outer_subnet', required: true, placeholder: '外部网段，用于判断入向公网地址，目标IP, 可多个地址'},
  {
    label: '关联设备', key: 'device_id', tagType: 'select-cascade', required: true,
    width: '130px',
    placeholder: '选择区域',
    options: {
      uri: APIUri.Region.restful.list,
      label: 'name', value: 'id',
      child: {
        params:{
          type: 'query',
          field: 'region_id'
        },
        placeholder: '选择设备',
        width: '130px',
        uri: APIUri.Device.restful.list,
        label: "name",
        value: "id",
      },
    }
  },
  {
    label: '实施类型', key: 'implement_type_id', tagType: 'select', required: true,
    options: {uri: APIUri.ImplementType.restful.list, label: 'name', value: 'id'}
  },
  {label: '描述信息', key: 'description', required: true},
]
</script>
