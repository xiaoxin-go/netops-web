<template>
  <a-table class="ant-table-striped"
           :scroll="{x:'max-content'}"
           :row-selection="props.selection?{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }:null"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
           :row-key="props.rowKey"
           :columns="props.columns"
           :data-source="dataSource"
           :loading="loading"
           :pagination="props.pagination && pagination"
           @change="handleTableChange"
           size="small">
    <template #bodyCell="{ column, record }">
      <!--  自定义插槽   -->
      <slot v-if="column.slot" :name="column.slot" :record="record"></slot>
      <!--   增加tooltip弹出框   -->
      <a-tooltip v-else-if="column.ellipsis === true">
        <template #title>
          <span>{{ formatRecordValue(record, column) }}</span>
        </template>
        <span>
          <rest-table-item :record="record" :column="column"></rest-table-item>
        </span>
      </a-tooltip>
      <span v-else>
        <rest-table-item :record="record" :column="column"></rest-table-item>
      </span>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import RestTableItem from "./components/VATableItem.vue";
import {defineProps, defineExpose} from "vue";
import propsOptions from "./extends/props"
import {useRequestPagination, formatRecordValue, useSelection} from "./extends/hooks";

const props = defineProps(propsOptions)
const {
  loading, pagination, data: dataSource, handleTableChange, reload
} = useRequestPagination(props.uri || "", props.defaultParams,  props.manual)

const {data:selectedRowKeys, change: onSelectChange} = useSelection()

defineExpose({reload, selectedRowKeys})

</script>
<style scoped>
</style>
