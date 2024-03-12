<template>
  <a-menu
    id="menu"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    theme="dark"
    @click="handleClick"
  >
    <menu-item :data="store.menuList"></menu-item>
  </a-menu>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {RouteLocationRaw, useRoute, useRouter} from 'vue-router'
import {GetMenu} from "./service";
import {store} from "@/store";
import {GetStorageMenu} from "@/utils/storage";
import MenuItem from "./MenuItem.vue"
import {Api, Menu} from "@/components/nav/extends/typings";

const route = useRoute()
const router = useRouter()

const selectedKeys = ref(['1'])
const openKeys = ref(['sub1'])

onMounted(() => {
  initMenu();
  setTimeout(()=>{
    selectedKeys.value = [route.path]
    openKeys.value = ["/" + route.path.split('/')[1]]
  }, 500)
});
// 初始化获取菜单，先从浏览器内存中获取，若内存中没有则调用接口
const initMenu = () => {
  if (store.menuList && store.menuList.length > 0) {
    return;
  }
  let menus = GetStorageMenu();
  if (menus && menus.length > 0) {
    store.menuList = menus;
    initAuths(store.menuList)
  } else {
    router.push({name: 'Login'})
    console.log("-------------> menus")
    // GetMenu();
  }
};


const initAuths = (menus: Menu[]) =>{
  if(!menus || menus.length == 0){
    return
  }
  menus.forEach(menu=>{
    if (menu.apis && menu.apis.length > 0){
      store.auths[menu.path] = menu.apis.filter(api=>api.select).map(api=>{
        return {method: api.method, uri: api.uri} as Api
      })
    }
    initAuths(menu.children)
  })
}


const handleClick = (e: { key: RouteLocationRaw }) => {
  console.log('click', e)
  router.push(e.key)
}
</script>
<style>
</style>
