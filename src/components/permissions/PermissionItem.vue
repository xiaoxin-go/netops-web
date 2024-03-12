<template>
  <a-collapse collapsible="icon" size="small" :bordered="false" style="margin-bottom:10px; background: #f7f9f9" v-model:activeKey="activeKey">
    <a-collapse-panel :key="source.name">
      <template #header>
        <a-checkbox
          v-model:checked="source.select"
          @change.stop="changeMenu"
          class="permission-menu-title"
        >
          {{ source.name }}
        </a-checkbox>
      </template>
      <div class="permission-interface" v-if="source.apis">
        <span
          class="permission-interface-item"
          v-for="inf in source.apis"
          :key="inf.id"
        >
          <a-checkbox v-model:checked="inf.select">{{
            inf.name
          }}</a-checkbox>
        </span>
      </div>
    <template v-if="source.children && source.children.length > 0">
      <div class="permission-menu-item">
        <Permissions v-model:data="source.children"></Permissions>
      </div>
    </template>
    </a-collapse-panel>
      </a-collapse>
</template>

<script lang="ts" setup>
import { defineProps, PropType, ref, watch } from 'vue';
import Permissions from './Permissions.vue';
import { Menu } from '@/components/permissions/typings';

const props = defineProps({
  item: Object as PropType<Menu>,
});
const activeKey = ref([]);

const source = ref<Menu>(props.item as Menu);
// 监听子项的选中状态
watch(
  () => [source.value.children, source.value.apis],
  (value, oldValue) => {
    source.value.select = isSelect();
  },
  { deep: true }
);
watch(()=>props.item, (value)=>{
  source.value = value as Menu
}, {deep: true})

const isSelect = (): boolean => {
  return (
    source.value.apis?.findIndex((item) => item.select === true) >=
      0 ||
    source.value.children?.findIndex((item) => item.select === true) >= 0
  );
};

const changeMenu = (e: { target: { checked: boolean } }) => {
  changeInterfaceSelect(e.target.checked, source.value);
  if (source.value.children) {
    changeChildSelect(e.target.checked, source.value.children);
  }
};
const changeInterfaceSelect = (isSelect: boolean, item: Menu) => {
  if (item.apis) {
    item.apis.forEach((item) => {
      item.select = isSelect;
    });
  }
};
// 改变子的选中状态跟随父的
const changeChildSelect = (isSelect: boolean, children: Menu[]) => {
  children.forEach((item) => {
    if (item.children) {
      changeChildSelect(isSelect, item.children);
    }
    item.select = isSelect;
    // 改变接口的选中状态，跟随父的
    changeInterfaceSelect(isSelect, item);
  });
};
</script>

<style scoped>
.permission-interface {
  display: flex;
  flex-wrap: wrap;
  padding-left: 40px;
}
.permission-list {
  padding: 15px;
}
.permission-interface-item {
  width: 25%;
  margin-bottom: 10px;
}
.permission-list .ant-collapse /deep/ .ant-collapse-item .ant-collapse-header{
  padding: 8px 16px!important
}
</style>
