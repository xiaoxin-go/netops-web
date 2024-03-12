<template>
  <VARest
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList"
      :form-options='formColumns'>
    <template #parse="{record}">
      <a-popconfirm  v-if="isParse" title="策略解析"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="parsePolicy({task_id: record.id})">
        <a title="策略解析" style="margin-right: 10px">解析</a>
      </a-popconfirm>
    </template>
    <template #show="{record}">
      <a title="查看详情" style="margin-right: 10px" @click="showDetail(record.device_id)">查看详情</a>
    </template>
    <template #deviceForm="{item, data}">
      <VASelect :disabled="item.disabled" ref="deviceRef" v-model:value="data.device_id" :options="deviceOptions"></VASelect>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from "@/api";
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {Ref, ref} from "vue";
import {useOperate} from "@/utils/hooks";
import {useRouter} from "vue-router";

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.InvalidPolicy.restful)
const isParse = auth.useIsAuth("parse")

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "实用工具"},
  {label: "无效策略解析"},
]

const searches: Array<VASearchItem> = [
  {field: 'name', placeholder: '请输入名称', paramsType: 'query', queryType: 'contains'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '网络区域', dataIndex: 'region', },
  {title: '关联设备', dataIndex: 'device'},
  {title: '描述', dataIndex: 'description', slot: 'edit'},
  {
    title: '状态', dataIndex: 'status', tagType: 'tag',
    options: {
      colors: {ready: 'default', running: 'orange', failed: 'error', success: 'success'},
      labels: {ready: '待执行', running: '执行中', failed: '执行失败', success: '执行成功'}
    }
  },
  {title: '更新时间', dataIndex: 'updated_at'},
  {title: '操作', dataIndex: 'action', slot: 'action', options: {slots: ['parse', 'show']}}
]
const formColumns: Array<VAFormItem> = [
  {
    label: '网络区域', key: 'region_id', tagType: 'select', required: true, change: (value: any) => {
      const params = {query: [{key: 'region_id', val: String(value), type: 'eq'}]}
      deviceRef.value.load(params)
    },
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'}, update: false,
  },
  {
    label: '关联设备', key: 'device_id', tagType: 'select', required: true, slot: 'deviceForm', update: false,
  },
  {label: '描述', key: 'description', required: true},
]
const deviceOptions = {uri: APIUri.Device.restful.list, label: 'name', value: 'id', manual: true}
const deviceRef: Ref = ref()

const router = useRouter()
const showDetail = (device_id: number) =>{
  router.push({name: "PolicyHitCount", query: {device_id: device_id}})
}

const parsePolicy = useOperate(APIUri.InvalidPolicy.parse)
</script>
