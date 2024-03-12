<template>
  <VARest v-if="uris.list"
      :uris="uris"
      :searchOptions="searches"
      :table-columns="tableColumns"
      :breadcrumbOptions="breadcrumbOptions"
      :form-options='formColumns'
  >
    <template #update="{ record }">
      <a-popconfirm v-if="isUpdatePolicy" title="更新策略"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="updatePolicy(record.id)">
        <a title="更新策略" style="margin-right: 10px">
          <VAIcon type="sync-outlined"></VAIcon>
        </a>
      </a-popconfirm>
      <a title="查看日志" style="margin-right: 10px"><VAIcon @click="showOperateLog(record.id)" type="profile-outlined"></VAIcon></a>
    </template>
  </VARest>
</template>
<script lang='ts' setup>
import {APIUri, post, update} from '@/api';
import {Modal} from "ant-design-vue";
import {VABreadcrumbItem} from "modules/components/VABreadcrumb/typings";
import {Auth} from "@/auth/common";
import {VASearchItem} from "modules/components/VASearch/typings";
import {VATableColumn} from "modules/components/VATable/extends/typing";
import {VAFormItem} from "modules/components/VAForm/extends/typing";
import {h} from "vue";
import {notify} from "@kyvg/vue3-notification";

const auth = new Auth()
const uris = auth.useRestfulUris(APIUri.NLBDevice.restful)
const isUpdatePolicy = auth.useIsAuth('updatePolicy')

const breadcrumbOptions: Array<VABreadcrumbItem> = [
  {label: "设备管理"},
  {label: "负载均衡设备"},
]

const searches: Array<VASearchItem> = [
  {
    field: 'region_id', placeholder: '选择属地', tagType: 'select', width: '130px', isSearch: true,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'},
  },
  {field: 'name__contains', placeholder: '请输入名称', isSearch: true}
]

const tableColumns: Array<VATableColumn> = [
  {title: '网络区域', dataIndex: 'region', width: 120},
  {title: '设备名', dataIndex: 'name', slot: 'edit', width: 200},
  {title: '设备IP', dataIndex: 'host', width: 120},
  {title: '设备端口', dataIndex: 'port', width: 90},
  {
    title: "是否启用", dataIndex: "enabled", tagType: "tag", width: 90,
    options: {
      colors: {1: 'green', 0: 'red'},
      labels: {1: '是', 0: '否'}
    }
  },
  {title: "策略解析状态", dataIndex: "parse_status", tagType: "tag", width: 120,
    options: {
      colors: {'init': 'processing', 'failed': 'error', 'success': 'success'},
      labels: {'init': '初始化', 'failed': '失败', 'success': '成功'}
    }
  },
  {title: '更新时间', dataIndex: 'updated_at', width: 160},
  {title: '操作', dataIndex: 'action', slot: 'action', options: {slots: ['update']}}
]
const formColumns: Array<VAFormItem> = [
  {
    label: '网络区域ID', key: 'region_id', tagType: 'select', required: true, update: false,
    options: {uri: APIUri.Region.restful.list, label: 'name', value: 'id'}
  },
  {label: '设备名', key: 'name', required: true, update: false},
  {label: '设备IP', key: 'host', required: true, update: false},
  {label: '设备端口', key: 'port', tagType: 'input-number', required: true},
  {label: '用户名', key: 'username', required: true},
  {label: '设备密码', key: 'password', required: true},
  {
    label: '设备类型', key: 'device_type_id', tagType: 'select', required: true,
    options: {uri: APIUri.NLBDeviceType.restful.list, label: 'name', value: 'id'}
  },
  {
    label: '是否启用', key: 'enabled', tagType: 'radio-group', required: true, default: 1,
    options: [{label: "是", value: 1}, {label: "否", value: 0}]
  },
]

const updatePolicy = async (deviceId: number) => {
  let res = await update(APIUri.NLBDevice.policy, {device_id: deviceId})
  if (res.data.code === 0) {
    notify({type: 'success', text: '策略解析中...详情可查看解析日志'})
  }
}

const showOperateLog = async (deviceId: number)=>{
  let res = await post(APIUri.NLBDevice.policyLog, {device_id: deviceId})
  if(res.data.code === 0){
    const type = res.data.data.status==='success'?'success':'error'
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
</script>
