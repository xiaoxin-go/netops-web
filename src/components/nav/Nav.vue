<template>
  <div id="components-layout-demo-custom-trigger">
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo">Netops</div>
        <Menu></Menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <div style="float: right;margin-right: 30px">
            <user-outlined style="margin-right: 5px; font-size: 20px" />
            <a>{{store.userInfo.username}}</a>
          </div>
        </a-layout-header>
        <a-layout-content :style="{ margin: '0 16px' }">
          <a-spin v-show="store.spinning" class="nav-spin" tip="加载中..."></a-spin>
          <router-view v-if="isRouteActive"></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons-vue'
import {store} from "@/store/index.ts";
import {onMounted, ref, nextTick, provide} from 'vue'
import Menu from '@/components/nav/Menu.vue'
import {getUserInfo} from "@/utils/storage.ts";
import {useRouter} from "vue-router";
// import {GetUserInfo} from "@/components/nav/service";
const collapsed = ref(false)
const isRouteActive = ref(true)
const router = useRouter()

onMounted(()=>{
  initUser()
})

const initUser = () => {
  if (store.userInfo.username && store.userInfo.username !== '') {
    return;
  }
  let user = getUserInfo();
  if (user?.username && user.username !== '') {
    store.userInfo = user;
  } else {
    router.push({name: 'Login'})
    // GetUserInfo()
  }
};
const reload = () =>{
  isRouteActive.value = false;
  nextTick(()=>{
    isRouteActive.value = true;
  })
}
provide('reload', reload)

</script>
<style>
#components-layout-demo-custom-trigger {
  display: flex;
  min-height: 100vh;
}
.ant-layout-header {
  height: 56px !important;
  line-height: 56px !important;
}
/*.ant-menu {*/
/*  !*background: #0655be !important;*!*/
/*  color: #ffffff !important;*/
/*}*/
.ant-layout-sider {
  /*background: #0655be !important;*/
}
.ant-menu-item:hover,
.ant-menu-submenu:hover,
.ant-menu-submenu-inline:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}
.ant-menu-inline {
  border: none !important;
}
.ant-menu-submenu-arrow {
  /*color: #ffffff !important;*/
}
.ant-menu-submenu-title {
  /*color: #ffffff !important;*/
}
.ant-menu-submenu-selected {
  /*color: #ffffff !important;*/
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background: rgba(255, 255, 255, 0.2) !important;
  /*color: #ffffff !important;*/
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 20px;
  line-height: 20px;
  margin: 16px;
  text-align: center;
  font-size: 16px;
  color: white;
}

.site-layout .site-layout-background {
  background: #fff;
}
.nav-spin{
  height: 100%;
  width: 100%;
  position: absolute!important;
  display: inline-block;
  opacity: 0.6!important;
  z-index: 999;
  padding-top: 200px!important;
  background: #fff;
}
</style>
