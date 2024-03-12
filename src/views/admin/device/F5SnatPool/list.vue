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

const uris = new Auth().useRestfulUris(APIUri.F5SnatPool.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "F5 Snat管理"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'device_id', placeholder: '请选择设备', paramsType: 'query', tagType: 'select', options: {
      uri: APIUri.NLBDevice.restful.list,
      label: 'name',
      value: 'id'
    }
  },
  {field: 'name', placeholder: '请输入名称', paramsType: 'query', queryType: 'contains'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '设备', dataIndex: 'device_name'},
  {title: 'pool名称', dataIndex: 'name', slot: 'edit'},
  {title: '网段信息', dataIndex: 'subnet'},
  {title: '更新时间', dataIndex: 'updated_at'},
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
        uri: APIUri.NLBDevice.restful.list,
        label: "name",
        value: "id",
      },
    }
  },
  {label: 'pool名称', key: 'name', required: true},
  {label: '网段信息', key: 'subnet', required: true},
]
</script>
