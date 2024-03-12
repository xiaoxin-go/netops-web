<template>
  <div class="permission-list" v-for="item in data" :key="item.id">
    <PermissionItem :item="item"></PermissionItem>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import PermissionItem from './PermissionItem.vue';
import { Menu } from '@/components/permissions/typings';

const props = defineProps({
  data: Object as PropType<Array<Menu>>,
});
</script>

<style scoped>
.permission-menu {
  padding: 15px;
  background: #fff;
  height: 100%;
  overflow: auto;
}
/* .permission-list {
  padding-left: 20px;
} */

/* .permission-interface-item {
  margin-right: 10px;
} */
</style>
