<template>
  <VARest
        :uris='uris'
        :search-options='searches'
        :manual="true"
        :table-columns='tableColumns'
        :breadcrumb-options='breadcrumbList'
  >
    <template #poolTable="{record}">
      <a-tooltip color="white" placement="right" overlayClassName="policy-command">
        <template #title>
          <div v-for="item in record.pool_nodes" :key="item.id">
            <span :style="`color:${stateColor[item.state]||'black'}`">{{item.name}}:{{item.state}}</span>
          </div>
        </template>
        <a>{{record.pool}}</a>
      </a-tooltip>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from '@/api';
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Policy.nlb.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "策略查询"},
  {label: "NLB策略"},
]

const stateColor = {
  down: "#e36060",
  up: "yellowgreen"
}

const searches: Array<VASearchItem> = [
  {field: 'device_id', placeholder: '请选择设备', tagType: 'select', isSearch: true,
    options: {uri: APIUri.NLBDevice.restful.list, label: 'name', value: 'id'}
  },
  {field: 'vs', placeholder: '请输入VS名称'},
  {field: 'dst', placeholder: '请输入目标地址'},
  {field: 'pool', placeholder: '请输入pool'},
  {field: 'member', placeholder: '请输入member'},
]

const tableColumns: Array<VATableColumn> = [
    {title: '设备', dataIndex: 'device', width: 150, ellipsis: true},
    {title: 'VS名称', dataIndex: 'name', width: 150, ellipsis: true},
    {title: 'Partition', dataIndex: 'partition', width: 120},
    {title: 'Destination', dataIndex: 'destination', width: 150},
    {title: 'Pool', dataIndex: 'pool', slot: "poolTable"},
    {title: 'SourceTranslation', dataIndex: 'source_address_translation', ellipsis: true},
    {title: 'Enabled', dataIndex: 'enabled', tagType: 'tag', options: {colors: {true: 'green', false: 'red'}}},
]
</script>
