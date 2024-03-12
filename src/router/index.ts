import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import {store} from "@/store";

const routes: Array<RouteRecordRaw> = [
  { path: '/auth/login', name: 'Login', component: () => import('@/views/auth/Login.vue') },
  {path: '/', redirect: '/task/firewall'},
  { path: '/task/firewall', name: 'TaskFirewall', component: () => import('@/views/task/firewall/list.vue') },
  { path: '/task/firewall/detail', name: 'TaskFirewallDetail', component: () => import('@/views/task/firewall/Detail.vue') },
  { path: '/task/firewall/config', name: 'TaskFirewallConfig', component: () => import('@/views/task/firewall/Config.vue') },

  { path: '/task/nlb', name: 'TaskNlb', component: () => import('@/views/task/nlb/list.vue') },
  { path: '/task/nlb/detail', name: 'TaskNlbDetail', component: () => import('@/views/task/nlb/Detail.vue') },

  // system
  { path: '/system/role', name: 'Role', component: () => import('@/views/system/Role.vue') },
  { path: '/system/user', name: 'User', component: () => import('@/views/system/User.vue') },
  { path: '/system/log', name: 'Log', component: () => import('@/views/system/Log/list.vue') },

  // 设备管理
  { path: '/device/firewall', name: 'DeviceFirewall', component: () => import('@/views/device/firewall/list.vue') },
  { path: '/device/firewall/backup', name: 'DeviceFirewallBackup', component: () => import('@/views/device/firewall/backup.vue') },
  { path: '/device/nlb', name: 'DeviceNLB', component: () => import('@/views/device/nlb/list.vue') },

  // 策略管理
  { path: '/policy/firewall', name: 'PolicyFirewall', component: () => import('@/views/policy/firewall/list.vue') },
  { path: '/policy/nlb', name: 'PolicyNLB', component: () => import('@/views/policy/nlb/list.vue') },
  { path: '/policy/firewall_nat', name: 'FirewallNat', component: () => import('@/views/policy/firewallNat/list.vue') },

    // 工具管理
  { path: '/tools/public_whitelist', name: 'PublicWhitelist', component: () => import('@/views/tools/PublicWhitelist/list.vue') },
  { path: '/tools/invalid_policy', name: 'InvalidPolicy', component: () => import('@/views/tools/InvalidPolicy/list.vue') },
  { path: '/tools/invalid_policy/policy_hit_count', name: 'PolicyHitCount', component: () => import('@/views/tools/InvalidPolicy/policyHitCount.vue') },

  // admin-platform
  { path: '/admin/menu', name: 'Menu', component: () => import('@/views/admin/platform/Menu/list.vue') },
  { path: '/admin/api', name: 'Api', component: () => import('@/views/admin/platform/Api/list.vue') },
  { path: '/admin/region', name: 'Region', component: () => import('@/views/admin/platform/Region/list.vue') },
  { path: '/admin/task_template', name: 'TaskTemplate', component: () => import('@/views/admin/platform/TaskTemplate/list.vue') },
  { path: '/admin/subnet', name: 'Ipaddress', component: () => import('@/views/admin/platform/Subnet/list.vue') },
  { path: '/admin/outbound_network_type', name: 'OutboundNetworkType', component: () => import('@/views/admin/platform/OutboundNetworkType/list.vue') },
  // admin-device
  { path: '/admin/device_type', name: 'DeviceType', component: () => import('@/views/admin/device/DeviceType/list.vue') },
  { path: '/admin/firewall_subnet', name: 'FirewallSubnet', component: () => import('@/views/admin/device/FirewallSubnet/list.vue') },
  { path: '/admin/nlb_subnet', name: 'NLBSubnet', component: () => import('@/views/admin/device/NlbSubnet/list.vue') },
  { path: '/admin/device_nat_pool', name: 'DeviceNatPool', component: () => import('@/views/admin/device/DeviceNatPool/list.vue') },
  { path: '/admin/nat_address', name: 'NatAddress', component: () => import('@/views/admin/device/NatAddress/list.vue') },
  {path: '/admin/f5_snat_pool', name: 'F5SnatPool', component: () => import('@/views/admin/device/F5SnatPool/list.vue')},

  // admin-jira
  { path: '/admin/issue_type', name: 'IssueType', component: () => import('@/views/admin/jira/IssueType/list.vue') },
  { path: '/admin/implement_type', name: 'ImplementType', component: () => import('@/views/admin/jira/ImplementType/list.vue') },
  { path: '/admin/task_status', name: 'TaskStatus', component: () => import('@/views/admin/jira/TaskStatus/list.vue') },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to) => {
      store.currentPath = to.path
    }
)

export default router
