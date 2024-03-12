<template>
  <VARest v-if="uris.list"
          :uris='uris'
          :breadcrumb-options="breadcrumbList"
          :searchDefaultParams="tableParams"
          :table-columns="tableColumns"
          :search-options="searches"
  >
    <template #source="{record}">
      <a-tooltip color="#4aa2e8" placement="right" overlayClassName="policy-command">
        <template #title><command :command="record.command"></command></template>
        <a>{{ record.source }}</a>
      </a-tooltip>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri} from "@/api";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import Command from "@/components/Command.vue"
import {useRoute} from "vue-router";

const route = useRoute()

const tableParams = {device_id: route.query.device_id}

const uris = {list: APIUri.InvalidPolicy.policyHitCountList}

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "实用工具"},
  {label: "无效策略解析", name: "InvalidPolicy"},
  {label: "策略命中详情"},
]

const searches: Array<VASearchItem> = [
  {field: 'state', placeholder: '是否有效', width: '120px', tagType: 'select', isSearch: true,
    options: [
      {label: '有效', value: 1},
      {label: '无效', value: 0},
    ]
  },
  {field: 'source__contains', placeholder: '源地址', width: "160px"},
  {field: 'destination__contains', placeholder: '目标地址', width: "160px"},
  {field: 'port', placeholder: '端口', width: '120px'},
]

const tableColumns: Array<VATableColumn> = [
  {dataIndex: "source", title: "源地址", width: 160, slot: 'source'},
  {dataIndex: "destination", title: "目的地址", width: 160},
  {dataIndex: "port", title: "端口", width: 80},
  {dataIndex: "protocol", title: "协议", width: 120},
  {dataIndex: "before_hit_count", title: "上次命中", width: 120, tagType: 'tag', options: {color: 'cyan'}},
  {dataIndex: "hit_count", title: "本次命中", width: 120, tagType: 'tag', options: {color: 'purple'}},
  {
    dataIndex: "state",
    title: "状态",
    width: 120,
    tagType: "tag",
    options: {colors: {1: "green", 0: "red"}, labels: {1: '有效', 0: '无效'}}
  }
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
