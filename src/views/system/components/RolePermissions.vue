<template>
  <a-drawer :maskClosable="false"
            width="1000px"
            @close="cancel"
            :open="visible"
            title="修改角色权限">
    <Permissions v-model:data="source" />
    <template #footer>
      <a-button style="margin-right: 8px" @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">提交</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import Permissions from '@/components/permissions/Permissions.vue';
import {defineEmits, defineProps, ref, watch} from "vue";
import {APIUri, update} from "@/api";
import {notify} from "@kyvg/vue3-notification";
import {useRequest} from "@/utils/hooks";
import {Menu, Api} from "@/components/permissions/typings";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  roleId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:visible'])

const cancel = () =>{
  emit('update:visible', false)
}

const menuIds = ref<number[]>([])
const apiIds = ref<number[]>([])

const {data: source, run: getPermissions} = useRequest(APIUri.Role.permission, {}, {manual: true})

const setParams = (menus: Menu[]) => {
  menus.forEach((menu: Menu) => {
    if (menu.select) {
      menuIds.value.push(menu.id)
      if (menu.apis) {
        menu.apis.forEach((api: Api) => {
          if (api.select)
            if (apiIds.value.indexOf(api.id) < 0){
              apiIds.value.push(api.id);
            }
        });
      }
      if (menu.children) setParams(menu.children);
    }
  });
};

// 更新角色权限
const save = async () => {
  // 获取用户选中的菜单ID和权限ID
  menuIds.value = []
  apiIds.value = []
  setParams(source.value as Menu[])
  const res = await update(APIUri.Role.permission, {
    role_id: props.roleId,
    menu_ids: menuIds.value,
    api_ids: apiIds.value
  })
  if (res.data.code === 0) {
    notify({type: 'success', text: res.data.msg})
    cancel()
  }
}

watch(()=>props.visible, (value)=>{
  if (value){
    getPermissions({id: props.roleId})
  }
})

</script>

<style scoped>

</style>
