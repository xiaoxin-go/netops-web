<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList"
      :form-options='formColumns'>
    <template #tableIcon="{record}">
      <SvgIcon :icon="record.icon" width="18" height="18"></SvgIcon>
    </template>
    <template #formIcon="{data}">
      <SelectSvgIcon v-model:value="data.icon" width="20" height="20"></SelectSvgIcon>
    </template>
    <template #relationApi="{record}">
      <a @click="clickRelationApi(record.id)" style="size: 12px; margin-right: 10px">关联接口</a>
    </template>
  </VARest>
  <RelationApi :menu-id="activeId" v-model:visible="relationVisible"></RelationApi>

</template>
<script lang='ts' setup>
import {APIUri} from '@/api';
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {ref} from "vue";
import RelationApi from './components/RelationApi.vue'

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Menu.restful)

const activeId = ref(0)
const relationVisible = ref(false)

const clickRelationApi = (menuId: number) => {
  relationVisible.value = true
  activeId.value = menuId
}

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "系统管理"},
  {label: "菜单管理"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  {title: "菜单名称", dataIndex: "name", slot: 'edit', width:200},
  {title: "英文名", dataIndex: "name_en", width:200},
  {title: "菜单路由", dataIndex: "path", width: 360},
  {title: "父菜单", dataIndex: "parent_name", width: 200},
  {title: "菜单图标", dataIndex: "icon", slot: 'tableIcon', width: 120},
  {title: "菜单排序", dataIndex: "sort", width: 120},
  {
    title: "是否启用", dataIndex: "enabled", tagType: "tag", width: 120,
    options: {
      colors: {1: 'green', 0: 'red'},
      labels: {1: '是', 0: '否'}
    }
  },
  {title: "操作", dataIndex: "action", slot: 'action', options: {slots: ['relationApi']}}
]
const formColumns: Array<VAFormItem> = [
  {label: '菜单名称', key: 'name', required: true},
  {label: '菜单英文名', key: 'name_en', required: true},
  {label: '菜单路由', key: 'path', required: true},
  {label: '菜单图标', key: 'icon', slot: 'formIcon'},
  {label: '菜单排序', key: 'sort', tagType: 'input-number', required: true},
  {
    label: '父菜单', key: 'parent_id', tagType: 'select',
    options: {uri: APIUri.Menu.restful.list, label: 'name', value: 'id', defaultParams: {size: 100}}
  },
  {
    label: '包含接口', key: 'api_ids', tagType: 'select',
    options: {uri: APIUri.Api.restful.list, label: 'name', value: 'id', mode: 'multiple', defaultParams: {size: 1000}}
  },
  {
    label: '是否启用', key: 'enabled', tagType: 'radio-group', required: true, default: 1,
    options: [{label: "是", value: 1}, {label: "否", value: 0}]
  },
]
</script>
