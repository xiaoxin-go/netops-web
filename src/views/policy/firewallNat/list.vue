<template>
  <VARest v-if="uris.list"
          :uris="uris"
          :search-options="searches"
          :table-columns="tableColumns"
          :breadcrumb-options="breadcrumbList"
          :manual="true"
  >
    <template #network="{record}">
      <a-tooltip placement="right"
                 overlayClassName="policy-command">
        <template #title>
          <command :command="record.command"></command>
        </template>
        <a class="item-src" v-html="record.network.replace(/,/g, '<br/>')"></a>
      </a-tooltip>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from "@/api";
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import Command from "@/components/Command.vue"

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Policy.firewallNat.restful)

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "设备配置"},
  {label: "防火墙nat查看"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'device_id', tagType: 'tabs-cascade', isSearch: true,
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
    }
  },
  {
    field: 'direction', tagType: 'select', isSearch: true,
    options: [
      {label: '入向', value: 'inside'},
      {label: '出向', value: 'outside'}
    ]
  },
  {field: 'network__contains', placeholder: '输入源地址',},
  {field: 'static__contains', placeholder: '输入映射地址'},
  {field: 'network_port__contains', placeholder: '输入源端口'}
]

const tableColumns: Array<VATableColumn> = [
  {title: '设备', dataIndex: 'device', width: 100},
  {
    title: "方向", dataIndex: "direction", tagType: "tag", options: {
      colors: {inside: "green", outside: "blue"},
      labels: {inside: "入向", outside: "出向"}
    }, width: 90
  },
  {title: '源网络信息', dataIndex: 'network', slot: 'network'},
  {title: '映射地址', dataIndex: 'static', width: 140},
  {title: '协议', dataIndex: 'protocol', width: 90},
  {title: '映射源端口', dataIndex: 'network_port', width: 120},
  {title: '映射目标端口', dataIndex: 'static_port'},
  {title: '目标地址', dataIndex: 'destination'},
]
</script>
<style>
.item-src {
  max-height: 200px;
  overflow-y: auto;
  display: inline-block;
}
.policy-command {
  max-width: 900px !important;
}
</style>
