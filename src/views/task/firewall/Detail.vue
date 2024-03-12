<template>
  <div class="main">
    <div>
      <VABreadcrumb :options="breadcrumbList"></VABreadcrumb>
    </div>
    <div class="main-body">
      <VADescriptions title="工单信息"
                      :column="4"
                      :options="descriptions"
                      :data="data.taskData">
        <!--  工单操作按钮   -->
        <template #extra>
          <get-attachment v-if="authEdit" :task-id="data.taskId" @on-callback="reload"></get-attachment>
          <!--    暂时注释送leader审核      -->
          <to-leader v-if="authToLeader && false" :task-id="data.taskId"
                     @on-callback="reload"></to-leader>
          <gene-config v-if="authGeneConfig" :task-id="data.taskId" @on-callback="reload"></gene-config>
<!--    上海沙箱的工单是执行方审批，其它是审核通过      -->
          <template v-if="authVerifyPass">
            <to-executor v-if="data.taskData.jira_region === '上海' && data.taskData.jira_environment === '沙箱环境'"
                         :task-id="data.taskId" @on-callback="reload"></to-executor>
            <verify-pass v-else :task-id="data.taskId" @on-callback="reload"></verify-pass>
          </template>
          <exec-task v-if="authExec" :task-id="data.taskId" @on-callback="reload"></exec-task>
          <reject-task v-if="authVerifyPass" :task-id="data.taskId" @on-callback="reload"></reject-task>
        </template>
        <template #jiraKeyDescription>
          <a :href="'https://jira.xiaoxin.xyz/browse/' + data.taskData.jira_key"
             target="_blank">{{ data.taskData.jira_key }}</a>
        </template>
        <template #jiraStatusDescription>
          <template v-if="authSyncJiraStatus">
            <a-tag :color="jiraStatusColors[data.taskData.jira_status]">{{ data.taskData.jira_status }}</a-tag>
            <a title="同步jira状态">
              <SyncOutlined @click="asyncJiraStatus({task_id: data.taskId})"/>
            </a>
          </template>
        </template>
        <template #statusDescription>
          <a-tooltip>
            <template #title>{{ data.taskData.err_info }}</template>
            <a-tag :color="execStatusColors[data.taskData.status]">{{ execStatusCn[data.taskData.status] }}</a-tag>
          </a-tooltip>
          <a title="刷新">
            <ReloadOutlined @click="reload"/>
          </a>
          <a title="操作日志" style="margin-left: 5px">
            <ProfileOutlined @click="showOperateLog" />
          </a>
        </template>
      </VADescriptions>
      <!--  添加策略，查看配置按钮  -->
      <div style="margin-top: 10px">
        <h3 style="display: inline-block">工单详情</h3>
        <div style="display: inline-block; float: right">
          <a-button style="margin-right: 10px"
                    type="primary"
                    size="small"
                    @click="toConfig">
            查看配置
          </a-button>
          <a-button v-if="authEdit"
                    style="margin-right: 10px"
                    type="primary"
                    danger
                    size="small"
                    @click="data.visible=true">
            + 添加策略
          </a-button>
        </div>
      </div>
      <!--  工单策略详情表格 -->
      <div style="flex: 1; min-height: 0;">
        <firewall-task-info v-if="data.taskId" :task-id="data.taskId" :is-edit="authEdit"></firewall-task-info>
      </div>
    </div>
  </div>
  <VAFormDrawer v-model:visible="data.visible"
                :data="data.formData"
                title="添加工作项"
                :options="data.modalOptions.columns"
                @close="data.visible=false"
                @submit="addTaskInfo">
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
import {useRoute, useRouter} from "vue-router";
import {APIUri, get, create, list} from "@/api";
import {reactive, onMounted, inject, h} from "vue";
import {Modal} from "ant-design-vue";
import {Task, TaskInfo} from "@/interface/task";
import {
  jiraStatusColors,
  execStatusColors, execStatusCn
} from "../common";
import {isOperate} from "../service";
import {Dict} from "@/interface/common";
import {VADescriptionsItem} from "modules/components/VADescriptions/typings";
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "../../../../modules/components/VABreadcrumb/typings";
import {notify} from "@kyvg/vue3-notification";
import RejectTask from '../components/RejectTask.vue';
import GeneConfig from "../components/GeneConfig.vue"
import ToExecutor from "../components/ToExecutor.vue"
import VerifyPass from "../components/VerifyPass.vue"
import ExecTask from "../components/ExecTask.vue"
import ToLeader from "../components/ToLeader.vue"
import GetAttachment from "../components/GetAttachment.vue"
import FirewallTaskInfo from "../components/FirewallTaskInfo.vue"
import {SyncOutlined, ReloadOutlined, ProfileOutlined} from '@ant-design/icons-vue'
import {useOperate} from "@/utils/hooks";

const router = useRouter();

const auth = new Auth("/task/firewall")
const authEdit = auth.useIsAuth("addInfo")
const authGeneConfig = auth.useIsAuth("geneConfig")
const authSyncJiraStatus = auth.useIsAuth("syncJiraStatus")
const authVerifyPass = auth.useIsAuth("verifyPass")
const authToLeader = auth.useIsAuth("toLeader")
const authExec = auth.useIsAuth("exec")


const reload: any = inject("reload");

const breadcrumbList: Array<VABreadcrumbItem> = [
  {label: "工单任务"},
  {label: "防火墙工单", name: "TaskFirewall"},
  {label: "工单详情"},
]

const data = reactive({
  taskId: 0,
  taskData: {} as Task,
  visible: false,
  formData: {protocol: "tcp"} as any,
  direction: "in",
  loading: false,
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
// 获取工单详情
const getTask = async () => {
  const res = await get(APIUri.Task.restful.get, data.taskId);
  if (res.data.code === 0) {
    data.taskData = res.data.data;
    await getTaskTemplate();
  }
};
// 获取工单模板信息
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
      notify({text: res.data.msg, type: 'success'})
      data.visible = false;
      reload()
    }
  })();
};

// 同步工单状态
const asyncJiraStatus = useOperate(APIUri.Task.syncJiraStatus, {}, ()=>{
  reload()
})

// 查看操作日志
const showOperateLog = async () => {
  const res = await list(APIUri.Task.operateLog, {task_id: data.taskId})
  if (res.data.code === 0 && res.data.data?.content) {
    Modal.info({
      style: {width: '800px'},
      title: "操作日志",
      content: h('div', {style: {overflowY: 'auto'}}, res.data.data.content.trim().split('\n').map(
          (item: string) => {
            return h('div', {style: {marginTop: '5px'}}, item)
          })),
    })
  }
}
// 添加工单策略，切换属地
const changeDirection = (direction: string) => {
  data.modalOptions.columns = data.formColumns[direction];
  console.log("columns---------------->", data.modalOptions.columns)
  data.formData = {} as TaskInfo;
  data.formData.direction = direction;
  data.formData.protocol = "tcp";
};
// 查看配置
const toConfig = () => {
  router.push(`/task/firewall/config?task_id=${data.taskData.id}`);
};
</script>

<style>
.policy-command {
  max-width: 900px !important;
}

.item-src {
  max-height: 200px;
  overflow-y: auto;
  display: inline-block;
}
</style>
