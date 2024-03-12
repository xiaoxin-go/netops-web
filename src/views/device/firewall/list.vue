<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :search-options="searches"
      :table-columns="tableColumns"
      :breadcrumb-options="breadcrumbOptions"
      :form-options='formColumns'
  >
    <template #restHeader>
      <a-button @click="showBackup" size="small" style="margin-left: 20px;" type="primary">查看备份</a-button>
    </template>
    <template #operate="{ record }">
      <a-popconfirm v-if="isUpdatePolicy" title="更新策略"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="updatePolicy(record.id)">
        <a title="更新策略" style="margin-right: 10px"><VAIcon type="sync-outlined"></VAIcon></a>
      </a-popconfirm>
      <a title="查看日志" style="margin-right: 10px"><VAIcon @click="showOperateLog(record.id)" type="profile-outlined"></VAIcon></a>
      <a-popconfirm v-if="isBackup" title="配置备份"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="backup({device_id: record.id})">
        <a title="配置备份" style="margin-right: 10px">配置备份</a>
      </a-popconfirm>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri, post, update} from '@/api';
import {Modal} from "ant-design-vue";
import {Auth} from "@/auth/common";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {h} from "vue";
import {notify} from "@kyvg/vue3-notification";
import {useOperate} from "@/utils/hooks";
import {useRouter} from "vue-router";

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.Device.restful)
const isUpdatePolicy = auth.useIsAuth('updatePolicy')
const isBackup = auth.useIsAuth('backup')
const router = useRouter()

const updatePolicy = async (deviceId: number) =>{
  let res = await update(APIUri.Device.policy, {device_id: deviceId})
  if (res.data.code === 0){
    notify({type: 'success', text: '策略解析中...详情可查看解析日志'})
  }
}
const backup = useOperate(APIUri.Device.backup)
const showOperateLog = async (deviceId: number)=>{
  let res = await post(APIUri.Device.policyLog, {device_id: deviceId})
  if(res.data.code === 0){
    const types: any = {success: 'success', failed: 'error'}
    const type = types[res.data.data.status] || 'info'
    Modal[type]({
      style: {width: '800px'},
      title: "策略解析日志",
      content: h('div', {style: {overflowY: 'auto'}}, res.data.data.content.trim().split('\n').map(
          (item: string) => {
            return h('div', {style: {marginTop: '5px'}}, item)
          })),
    })
  }
}
const showBackup = ()=>{
  router.push({name: 'DeviceFirewallBackup'})
}
const breadcrumbOptions: Array<VABreadcrumbItem> = [
  {label: "设备管理"},
  {label: "防火墙设备"},
]
const searches: Array<VASearchItem> = [
  {
    field: 'region_id', placeholder: '选择属地', tagType: 'select', width: '130px', isSearch: true,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'},
  },
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]
const tableColumns:Array<VATableColumn> = [
  {title: '网络区域', dataIndex: 'region', width: 100,},
  {title: '设备名', dataIndex: 'name', slot: 'edit', width: 170, ellipsis: true},
  {title: '设备地址', dataIndex: 'host', width: 130},
  {title: '端口', dataIndex: 'port', width: 80, tagType: 'tag'},
  {title: '设备类型', dataIndex: 'device_type', width: 100},
  {title: "策略解析状态", dataIndex: "parse_status", tagType: "tag", width: 120,
    options: {
      colors: {'init': 'processing', 'failed': 'error', 'success': 'success'},
      labels: {'init': '初始化', 'failed': '失败', 'success': '成功'}
    }
  },
  {title: "是否启用", dataIndex: "enabled", tagType: "tag", width: 90,
    options: {
      colors: {1: 'green', 0: 'red'},
      labels: {1: '是', 0: '否'}
    }
  },
  {title: "操作", dataIndex: 'action', slot: 'action', options: {slots: ['operate']}, width: 200}
]
const formColumns: Array<VAFormItem> = [
  {
    label: '网络区域', key: 'region_id', tagType: 'select', required: true,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'}
  },
  {label: '设备名', key: 'name', required: true, update: false},
  {label: '设备地址', key: 'host', required: true},
  {label: '设备端口', key: 'port', tagType: "input-number", required: true},
  {label: '用户名', key: 'username', required: true},
  {label: '设备密码', key: 'password', required: true},
  {label: 'Enable密码', key: 'enable_password'},
  {
    label: '设备类型', key: 'device_type_id', tagType: 'select', required: true,
    options: {uri: APIUri.DeviceType.restful.list, label: 'name', value: 'id'}
  },
  {label: '入向策略', key: 'in_policy'},
  {label: '出出策略', key: 'out_policy'},
  {label: '入向Deny策略名', key: 'in_deny_policy_name',update: false},
  {label: '出向Deny策略名', key: 'out_deny_policy_name', update: false},
  {
    label: '是否启用', key: 'enabled', tagType: 'radio-group', required: true, default: 1,
    options: [{label: "是", value: 1}, {label: "否", value: 0}]
  },
]
</script>
<style scoped>
.log-p{
  height: 16px;
  line-height: 16px;
}
</style>
