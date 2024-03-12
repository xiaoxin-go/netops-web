<template>
  <VARest :uris="uris"
          :search-options="searches"
          :table-columns="tableColumns"
          :breadcrumb-options="breadcrumbList">
    <template #download="{record}">
      <a-popconfirm v-if="isDownload" title="下载配置"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="download(record)">
        <a>下载</a>
      </a-popconfirm>
    </template>
    <template #size="{record}">
      <a-tag :color="sizeColor(record.size)">{{parseSize(record.size)}}</a-tag>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri, list} from "@/api";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {Auth} from "@/auth/common";
import {notify} from "@kyvg/vue3-notification";
const auth = new Auth()
const uris = {list: APIUri.Backup.list}
const isDownload = auth.useIsAuth('download')

// 导出附件
const download = async (record: any) => {
  const res = await list(APIUri.Backup.download, {backup_id: record.id}, {responseType: 'blob'})
  if (res.data && res.data.msg){
    notify({type: 'error', text: res.data.msg})
    return
  }
  if (res.status === 200) {
    let blobUrl = window.URL.createObjectURL(new Blob([res.data], {
      type: "application/zip",
    }))
    const a = document.createElement("a");
    a.style.display = "none";
    a.download = record.filename;
    a.href = blobUrl;
    a.click();
  }
}

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "设备管理"},
  {label: "防火墙管理", name: "DeviceFirewall"},
  {label: "配置备份"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'device_id', tagType: 'select-cascade', isSearch: true, width: '140px', placeholder: '请选择属地',
    options: {
      uri: APIUri.Region.restful.list, label: 'name', value: 'id',
      child: {
        params: {
          field: "region_id",
        },
        placeholder: "请选择设备",
        uri: APIUri.Device.restful.list,
        label: 'name', value: 'id',
        size: 'small',
        width: "150px"
      },
    },
  },
  {field: 'filename__contains', placeholder: '请输入文件名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  { title: "设备", dataIndex: "device"},
  { title: "文件名", dataIndex: "filename" },
  { title: "文件大小", dataIndex: "size", slot: 'size'},
  { title: "Md5", dataIndex: "md5" },
  { title: "更新时间", dataIndex: "updated_at" },
  { title: "操作", dataIndex: "action", slot: "action", options: {slots: ['download']}}
]

const parseSize = (size: number) =>{
  if (size > 1024 * 1024){
    return `${parseInt(size/1024/1024)}MB`
  }
  if (size > 1024){
    return `${parseInt(size/1024)}KB`
  }
  return size + "B"
}
const sizeColor = (size: number) =>{
  if (size > 1024){
    return "gold"
  }
  if (size > 1024*1024){
    return "volcano"
  }
  if(size > 1024*1024*1024){
    return "red"
  }
  return "default"
}
</script>
