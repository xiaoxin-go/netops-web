<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div>
      <VABreadcrumb :options="breadcrumbList"></VABreadcrumb>
    </div>
    <div class="main-body">
      <VADescriptions title="工单信息"
                      :column="4"
                      :options="descriptions"
                      :data="data.taskData">
        <template #extra>
          <get-attachment v-if="authEdit" :task-id="data.taskId" @on-callback="reload"></get-attachment>
          <!--    暂时注释送leader审核      -->
          <to-leader v-if="authToLeader && false" :task-id="data.taskId" @on-callback="reload"></to-leader>
          <gene-config v-if="authGeneConfig" :task-id="data.taskId" @on-callback="reload"></gene-config>
          <verify-pass v-if="authVerifyPass" :task-id="data.taskId" @on-callback="reload"></verify-pass>
          <exec-task v-if="authExec" :task-id="data.taskId" @on-callback="reload"></exec-task>
          <reject-task v-if="authVerifyPass" :task-id="data.taskId" @on-callback="reload"></reject-task>
        </template>
        <template #jiraKeyDescription>
          <a :href="'https://jira.xiaoxin-go.xyz/browse/' + data.taskData.jira_key"
             target="_blank">{{ data.taskData.jira_key }}</a>
        </template>
        <template #jiraStatusDescription>
          <template v-if="authSyncJiraStatus">
            <a-tag :color="jiraStatusColors[data.taskData.jira_status]">{{ data.taskData.jira_status }}</a-tag>
            <a title="同步jira状态">
              <VAIcon @click="asyncJiraStatus" type="reload-outlined"></VAIcon>
            </a>
          </template>
        </template>
        <template #statusDescription>
          <a-tooltip>
            <template #title>{{ data.taskData.err_info }}</template>
            <a-tag :color="execStatusColors[data.taskData.status]">{{ execStatusCn[data.taskData.status] }}</a-tag>
          </a-tooltip>
          <a title="刷新">
            <VAIcon @click="reload" type="reload-outlined"></VAIcon>
          </a>
          <a title="操作日志" style="margin-left: 5px">
            <VAIcon @click="showOperateLog" type="profile-outlined"></VAIcon>
          </a>
        </template>
      </VADescriptions>
      <div style="margin-top: 10px">
        <h3 style="display: inline-block">工单详情</h3>
        <div style="display: inline-block; float: right">
          <a-button v-if="authEdit"
                    style="margin-right: 20px"
                    type="danger"
                    size="small"
                    @click="data.visible=true">
            + 添加策略
          </a-button>
        </div>
      </div>
      <div style="flex: 1; min-height: 0;">
        <nlb-task-info v-if="data.taskId" :task-id="data.taskId" :is-edit="authEdit"></nlb-task-info>
      </div>
    </div>
  </div>
  <VAFormDrawer v-model:visible="data.visible"
                :data="data.formData"
                title="添加工作项"
                :options="data.modalOptions.columns"
                @close="data.visible=false"
                @onSubmit="addTaskInfo">
    <template #modal-header>
      <a-tabs v-model:activeKey="data.direction"
              @change="changeDirection">
        <a-tab-pane v-for="item in data.directionOptions"
                    :key="item.value">
          <template #tab>
            <span>
              <VAIcon :type="item.tag"
                      style="display: inline-block"></VAIcon>
              {{ item.label }}
            </span>
          </template>
        </a-tab-pane>
      </a-tabs>
    </template>
  </VAFormDrawer>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {APIUri, get, create, list} from "@/api";
import {reactive, onMounted, inject, h} from "vue";
import {Modal} from "ant-design-vue";
import {Task, TaskInfo} from "@/interface/task";
import {
  jiraStatusColors,
  execStatusColors,execStatusCn
} from "../common";
import {isOperate} from "../service";
import {Dict} from "@/interface/common";
import {post} from "@/api"
import {VADescriptionsItem} from "modules/components/VADescriptions/typings";
import {VABreadcrumbItem} from "../../../../modules/components/VABreadcrumb/typings";
import {Auth} from "@/auth/common";
import {notify} from "@kyvg/vue3-notification";
import RejectTask from '../components/RejectTask.vue';
import GeneConfig from "../components/GeneConfig.vue"
import VerifyPass from "../components/VerifyPass.vue"
import ExecTask from "../components/ExecTask.vue"
import ToLeader from "../components/ToLeader.vue"
import GetAttachment from "../components/GetAttachment.vue"
import NlbTaskInfo from "../components/NlbTaskInfo.vue"

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "工单任务"},
  {label: "负载均衡工单", name: "TaskNlb"},
  {label: "工单详情"},
]

const auth = new Auth()
const authEdit = auth.useIsAuth("addInfo")
const authGeneConfig = auth.useIsAuth("geneConfig")
const authSyncJiraStatus = auth.useIsAuth("syncJiraStatus")
const authVerifyPass = auth.useIsAuth("verifyPass")
const authToLeader = auth.useIsAuth("toLeader")
const authExec = auth.useIsAuth("exec")

const reload: any = inject("reload");

const data = reactive({
  taskId: 0,
  taskData: {} as Task,
  visible: false,
  formData: {protocol: "tcp"} as any,
  direction: "in",
  loading: false,
  table: {
    reload: false,
  },
  directionOptions: [],
  formColumns: {} as any,
  modalOptions: {
    title: "添加工作项",
    uri: "",
    method: "POST",
    columns: []
  },
});

const descriptions: Array<VADescriptionsItem> = [
  {label: "工单号", key: "jira_key", slot: 'jiraKeyDescription'},
  {label: "属地", key: "jira_region"},
  {label: "环境", key: "jira_environment"},
  {label: "策略类型", key: "implement_type"},
  {label: "创建人", key: "creator"},
  {
    label: "工单状态",
    key: "jira_status",
    tagType: "tag",
    colors: jiraStatusColors,
    slot: 'jiraStatusDescription'
  },
  {label: "任务状态", key: "status", slot: "statusDescription"},
  {label: "描述", key: "summary"}
]

const route = useRoute();

onMounted(() => {
  if (!route.query.task_id) {
    notify({type: 'error', text: '任务ID不能为空'})
    return;
  }
  data.taskId = parseInt(route.query.task_id.toString());
  getTask();
});

const getTask = async () => {
  const res = await get(APIUri.Task.restful.get, data.taskId);
  if (res.data.code === 0) {
    data.taskData = res.data.data;
    await getTaskTemplate();
  }
};

const getTaskTemplate = async () => {
  const res = await get(
      APIUri.TaskTemplate.restful.get,
      data.taskData.template_id
  );
  if (res.data.code === 0) {
    const obj = JSON.parse(res.data.data.content);

    data.directionOptions = obj.direction;
    data.direction = obj.direction[0].value;

    data.formColumns = obj.formColumns;
    data.modalOptions.columns = obj.formColumns[data.direction];
    data.formData.direction = data.direction;
  }
};

const addTaskInfo = (params: Dict) => {
  (async () => {
    data.formData = {...data.formData, ...params}
    data.formData.task_id = data.taskId
    data.formData.src = data.formData.src.replace(/\n/g, ',')
    data.formData.dst = data.formData.dst.replace(/\n/g, ',')
    data.formData.dport = data.formData.dport.replace(/\n/g, ',')
    let res = await create(APIUri.Task.info.restful.create, data.formData);
    if (res.data.code === 0) {
      notify({type: 'success', text: res.data.msg})
      data.visible = false;
      reload()
    }
  })();
};
const asyncJiraStatus = () => {
  post(APIUri.Task.syncJiraStatus, {task_id: data.taskId}).then(reload)
}
const showOperateLog = async () => {
  const res = await list(APIUri.Task.operateLog, {task_id: data.taskId})
  if (res.data.code === 0 && res.data.data?.content) {
    Modal.info({
      style: {width: '500px'},
      title: "操作日志",
      content: h('div', {style: {overflowY: 'auto'}}, res.data.data.content.trim().split('\n').map(
          (item: string) => {
            return h('div', {style: {marginTop: '5px'}}, item)
          })),
    })
  }
}
const changeDirection = (direction: string) => {
  data.modalOptions.columns = data.formColumns[direction];
  data.formData = {} as TaskInfo;
  data.formData.direction = direction;
  data.formData.protocol = "tcp";
};
</script>

<style>
.policy-command {
  max-width: 900px !important;
}

.ant-popover-content {
  max-height: 500px;
  overflow-y: auto;
}
.exec-btn{
  margin-right: 10px;
  color: #fff;
  background: #87d068;
  border-color: #87d068;
}
.exec-btn:hover{
  opacity: 0.87;
}

.to-leader-btn {
  margin-right: 10px;
  background-color: #5c68f8;
  border-color: #5c68f8
}

.to-leader-btn:hover {
  background-color: #5c7eff;
  border-color: #5c7eff
}

.gene-config-btn {
  margin-right: 10px;
  background-color: #cf5bfc;
  border-color: #cf5bfc
}

.gene-config-btn:hover {
  background-color: #d476f8;
  border-color: #d476f8
}

.verify-pass-btn {
  margin-right: 10px;
  background-color: #eb0dc0;
  border-color: #eb0dc0
}

.verify-pass-btn:hover {
  background-color: rgba(247, 39, 206, 0.87);
  border-color: rgba(247, 39, 206, 0.87)
}
</style>
