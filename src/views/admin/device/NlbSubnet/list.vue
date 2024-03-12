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
import {APIUri} from '@/api';
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.NLBSubnet.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "负载均衡网段"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'region_id', placeholder: '选择区域', tagType: 'select', width: '130px', isSearch: true,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'},
  },
  {field: 'subnet__contains', placeholder: '请输入网段'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '网络区域', dataIndex: 'region'},
  {title: '对外网段', dataIndex: 'subnet', slot: 'edit'},
  {title: '关联设备', dataIndex: 'device'},
  {title: '描述信息', dataIndex: 'description'},
  {title: '更新时间', dataIndex: 'updated_at'},
  {title: '操作', dataIndex: 'action', slot: 'action'}]
const formColumns: Array<VAFormItem> = [
  {label: '对外网段', key: 'subnet', required: true},
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
        uri: APIUri.NLBDevice.restful.list,
        label: "name",
        value: "id",
      },
    }
  },
  {label: '描述信息', key: 'description'},
]
</script>
