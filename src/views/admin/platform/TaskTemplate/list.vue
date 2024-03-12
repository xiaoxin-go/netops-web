<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbList"
      :form-options='formColumns'>
    <template #updateAuthor="{ record }">
      <a style="margin-right: 10px" @click.prevent="getTaskTemplate(record.id)">查看</a>
    </template>
    <template #formContent="{data}">
      <VACodemirror
          v-model:value="data.content"
      >
      </VACodemirror>
    </template>
  </VARest>
  <VAFormDrawer v-model:visible="data.visible"
              :data="data.formData"
              title="查看模板"
                @close="data.visible=false"
              :options="data.modalOptions.columns">
    <template #modal-header>
      <a-tabs v-model:activeKey="data.direction"
              @change="changeDirection">
        <a-tab-pane v-for="item in data.directionOptions"
                    :key="item.value">
          <template #tab>
            <span>
              <VAIcon :type="item.tag"
                    style="display: inline-block"></VAIcon>
              {{item.label}}
            </span>
          </template>
        </a-tab-pane>
      </a-tabs>
    </template>
    <template #footer>
      <span></span>
    </template>
  </VAFormDrawer>
</template>
<script lang='ts' setup>
import { APIUri, get } from "@/api";
import { reactive} from "vue";
import { TaskInfo } from "@/interface/task";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {Auth} from "@/auth/common";

const uris = new Auth().useRestfulUris(APIUri.TaskTemplate.restful)
const data = reactive({
  visible: false,
  activeId: 0,
  formData: { protocol: "tcp" } as any,
  direction: "in",
  loading: false,
  directionOptions: [],
  formColumns: {},
  modalOptions: {
    title: "添加工作项",
    uri: "",
    method: "POST",
    columns: []
  }
});

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "配置管理"},
  {label: "平台配置"},
  {label: "模板配置"},
]

const searches: Array<VASearchItem> = [
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  {
    title: "Name",
    dataIndex: "name",
    slot: "edit",
    width: 200,
  },
  { title: "更新时间", dataIndex: "updated_at" },
  {
    title: "操作",
    dataIndex: "action",
    slot: "action",
    options: { slots: ["updateAuthor"] }
  }
]
const formColumns: Array<VAFormItem> = [
  { label: "Name", key: "name", required: true },
  { label: "Content", key: "content", required: true, slot: 'formContent' }
]

const getTaskTemplate = async (roleId: number) => {
  data.visible = true;
  const res = await get(APIUri.TaskTemplate.restful.get, roleId);
  if (res.data.code === 0) {
    const obj = JSON.parse(res.data.data.content);
    data.directionOptions = obj.direction;
    data.direction = obj.direction[0].value;
    data.formColumns = obj.formColumns;
    data.modalOptions.columns = obj.formColumns[data.direction];
    data.formData.direction = data.direction;
  }
};
const changeDirection = (direction: string) => {
  data.modalOptions.columns = data.formColumns[direction];
  data.formData = {} as TaskInfo;
  data.formData.direction = direction;
  data.formData.protocol = "tcp";
};
</script>
<style scoped>
.policy-command {
  max-width: 900px !important;
}
</style>
