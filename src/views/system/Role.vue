<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList"
      :form-options='formColumns'>
    <template #updatePermission="{ record }">
      <a style="margin-right: 10px" @click.prevent="clickEdit(record.id)">编辑权限</a>
    </template>
  </VARest>
  <RolePermissions v-model:role-id="activeId" v-model:visible="visible"></RolePermissions>
</template>
<script lang="ts" setup>
import {APIUri} from "@/api";
import {ref} from "vue";
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "../../../modules/components/VABreadcrumb/typings";
import {VASearchItem} from "../../../modules/components/VASearch/typings";
import {VATableColumn} from "../../../modules/components/VATable/extends/typing";
import {VAFormItem} from "../../../modules/components/VAForm/extends/typing";
import RolePermissions from './components/RolePermissions.vue'

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Role.restful)

const visible = ref(false)
const activeId = ref(0)


const clickEdit = (roleId: number) => {
  activeId.value = roleId
  visible.value = true
}

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "系统管理"},
  {label: "角色管理"},
]
const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]
const tableColumns: Array<VATableColumn> = [
  {title: "名称", dataIndex: "name", slot: "edit"},
  {title: "描述", dataIndex: "description"},
  {title: "更新时间", dataIndex: "updated_at"},
  {title: "操作", dataIndex: 'action', slot: 'action', options: {slots: ["updatePermission"]}},
]
const formColumns: Array<VAFormItem> = [
  {label: 'Name', key: 'name', required: true, update: false},
  {label: 'Description', key: 'description'},
]

</script>
<style scoped>
.parent-menu {
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.parent-api {
  margin: 10px 0 20px 30px;
}

.parent-api-item, .child-author-item {
  display: inline-block;
  width: 25%;
}

.child-menu {
  margin-left: 30px;
  margin-top: 5px;
}

.child-author {
  margin: 5px 0 10px 60px;
}

.save-btn {
  position: absolute;
  right: 40px;
  top: 10px;
}
</style>
