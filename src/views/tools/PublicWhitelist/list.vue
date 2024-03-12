<template>
  <VARest
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList"
      :form-options='formColumns'>
    <template #restHeader>
      <a-popconfirm @confirm="parseAll" title="确定解析所有公网any白名单吗？">
        <a-button size="small" class="parse-all-btn">全部解析</a-button>
      </a-popconfirm>
    </template>
    <template #parse="{record}">
      <a-popconfirm @confirm="parse(record)" title="确定解析白名单地址吗？">
        <a href="" style="margin-right: 10px">解析</a>
      </a-popconfirm>
    </template>
    <template #deviceForm="{data}">
      <VASelect ref="deviceRef" v-model:value="data.device_id" :options="deviceOptions"></VASelect>
    </template>
    <template #nlbDeviceForm="{data}">
      <VASelect ref="nlbDeviceRef" v-model:value="data.nlb_device_id" :options="nlbDeviceOptions"></VASelect>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri, post} from "@/api";
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn, VATableRecord} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {Ref, ref} from "vue";

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.PublicWhitelist.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "PublicWhitelist"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
    {title: '网络区域', dataIndex: 'region'},
    {title: '解析类型', dataIndex: 'type'},
    {title: '防火墙设备', dataIndex: 'device'},
    {title: '负载均衡设备', dataIndex: 'nlb_device'},
    {title: '描述', dataIndex: 'description'},
    {title: '操作', dataIndex: 'action', slot: 'action', options: {slots: ['parse']}}
]
const formColumns: Array<VAFormItem> = [
  {
    label: '网络区域', key: 'region_id', tagType: 'select', required: true, change: (value: any)=>{
      const params = {query: [{key: 'region_id', val: String(value), type: 'eq'}]}
      deviceRef.value.load(params)
      nlbDeviceRef.value.load(params)
    },
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'}
  },
  {label: '解析类型', key: 'type', required: true, tagType: 'radio-group', options: [
      {label: 'F5-策略', value: 'f5-policy'},
      {label: 'Nat-策略', value: 'nat-policy'},
    ],
    placeholder: '上海沙箱是nat-策略，其它是f5-策略', default: 'f5-policy'
  },
  {
    label: '防火墙设备', key: 'device_id', tagType: 'select', required: true, slot: 'deviceForm',
  },
  {
    label: '负载均衡设备', key: 'nlb_device_id', tagType: 'select', slot: 'nlbDeviceForm'
  },
  {label: '描述', key: 'description'},
]
const deviceOptions = {uri: APIUri.Device.restful.list, label: 'name', value: 'id', manual: true}
const nlbDeviceOptions = {uri: APIUri.NLBDevice.restful.list, label: 'name', value: 'id', manual: true}
const deviceRef: Ref = ref()
const nlbDeviceRef: Ref = ref()
const parse = async (record: VATableRecord) => {
  const res = await post(APIUri.PublicWhitelist.parse, {id: record.id}, {responseType: 'blob'})
  if(res.status === 200){
    let blobUrl = window.URL.createObjectURL(new Blob([res.data], {
      type: "application/vnd.ms-excel",
    }))
    const a = document.createElement("a");
    a.style.display = "none";
    a.download = "parse.xlsx";
    a.href = blobUrl;
    a.click();
  }
}
const parseAll = async () =>{
  const res = await post(APIUri.PublicWhitelist.parseAll, {}, {responseType: 'blob'})
  if(res.status === 200){
    let blobUrl = window.URL.createObjectURL(new Blob([res.data], {
      type: "application/vnd.ms-excel",
    }))
    const a = document.createElement("a");
    a.style.display = "none";
    a.download = "parse.xlsx";
    a.href = blobUrl;
    a.click();
  }
}
</script>
<style scoped>
.parse-all-btn{
  color: #fff;
  background-color: #4949ea;
  border-color: #4949ea;
  margin-left: 15px;
}
.parse-all-btn:hover{
  background-color: rgba(100, 100, 238, 0.89);
  border-color: rgba(100, 100, 238, 0.89);
}
</style>
