<template>
  <VARest v-if="uris.list"
          :uris='uris'
          :breadcrumb-options="breadcrumbList"
          :manual="true"
          :table-columns="tableColumns"
          :search-options="searches"
  >
    <template #name="{record}">
      <a-tooltip color="#4aa2e8" placement="right" overlayClassName="policy-command">
        <template #title><command :command="record.command"></command></template>
        <a>{{ record.name }}</a>
      </a-tooltip>
    </template>
    <template #src_group="{record}">
      <a-popover placement="right">
        <template #content>
          <p v-for="item in record.src_group.split(',')"
             :key="item">{{ item }}</p>
        </template>
        <div style="width: 150px; overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
          {{ record.src_group }}
        </div>
      </a-popover>
    </template>
    <template #src="{record}">
      <a-popover placement="right" style="max-height: 800px;overflow-y: auto">
        <template #content>
          <p v-for="item in record.src.split(',')"
             :key="item">{{ item }}</p>
        </template>
        <div style="width: 120px; overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
          {{ record.src }}
        </div>
      </a-popover>
    </template>
    <template #dst_group="{record}">
      <a-popover placement="right">
        <template #content>
          <p v-for="item in record.dst_group.split(',')"
             :key="item">{{ item }}</p>
        </template>
        <div style="width: 150px; overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
          {{ record.dst_group }}
        </div>
      </a-popover>
    </template>
    <template #dst="{record}">
      <a-popover placement="right">
        <template #content>
          <p v-for="item in record.dst.split(',')"
             :key="item">{{ item }}</p>
        </template>
        <div style="width: 120px; overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
          {{ record.dst }}
        </div>
      </a-popover>
    </template>
    <template #tablePort="{record}">
      <a-popover placement="right" style="max-height: 800px;overflow-y: auto">
        <template #content>
          <p v-for="item in record.port.split(',')"
             :key="item">{{ item }}</p>
        </template>
        <div style="width: 120px; overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
          {{ record.port }}
        </div>
      </a-popover>
    </template>
    <template #valid="{record}">
      <a-tag :color="record.valid?'green': 'red'">{{record.valid}}</a-tag>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from "@/api";
import {Auth} from "@/auth/common";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import Command from "@/components/Command.vue"

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Policy.firewall.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "策略查询"},
  {label: "防火墙策略"},
]

const directionLabel = {
  inside: "入向",
  outside: "出向"
}
const directionColor = {
  inside: "red",
  outside: "orange"
}

const searches: Array<VASearchItem> = [
  {
    field: 'device_id', tagType: 'tabs-cascade', isSearch: true, width: '160px',
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
        width: "120px"
      },
    },
  },
  {field: 'direction', placeholder: '选择方向', tagType: 'select', options: [
      {label: '入向', value: 'inside'},
      {label: '出向', value: 'outside'},
    ],
    width: "160px"},
  {field: 'src', placeholder: '源地址', width: "160px"},
  {field: 'dst', placeholder: '目标地址', width: "160px"},
  {field: 'port', placeholder: '端口', width: '120px'},
]

const tableColumns: Array<VATableColumn> = [
  {
    dataIndex: "direction",
    title: "策略方向",
    width: 120,
    tagType: "tag",
    options: {colors: directionColor, labels: directionLabel}
  },
  {dataIndex: "name", title: "策略名称", width: 160, slot: 'name'},
  {dataIndex: "src", title: "源地址", width: 220, slot: 'src'},
  {dataIndex: "dst", title: "目的地址", width: 220, slot: 'dst'},
  {dataIndex: "port", title: "端口", width: 80, slot: 'tablePort'},
  {dataIndex: "protocol", title: "协议", width: 120},
  {
    dataIndex: "action",
    title: "Action",
    width: 120,
    tagType: "tag",
    options: {colors: {permit: "green", deny: "red"}}
  },
  {dataIndex: "valid", title: "状态", width: 120, slot: 'valid'},
]
</script>
<style>
.ant-popover-content {
  max-height: 500px;
  overflow-y: auto;
}

.policy-command {
  max-width: 900px !important;
}
</style>
