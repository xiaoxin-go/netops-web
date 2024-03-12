<template>
  <div class="va-rest">
    <div>
      <VABreadcrumb v-if="props.breadcrumbOptions.length > 0" :options="props.breadcrumbOptions"></VABreadcrumb>
    </div>
    <div class="va-rest-main">
      <!-- title  -->
      <div class="va-rest-header">
        <VASearch v-if="props.searchOptions" size="small" :options="props.searchOptions" @on-search="onSearch">
        </VASearch>
        <slot name="restHeader"></slot>
      </div>
      <!--  table  -->
      <div class="va-rest-body">
        <a-button class="va-rest-add" @click="add"
                  v-if="props.uris.create" type="primary" size="small">
          <template #icon>
            <plus-outlined/>
          </template>
          添加
        </a-button>
        <div class="va-rest-table">
          <v-a-table ref="table" v-if="props.uris.list"
                     :selection="props.selection"
                     :uri="props.uris?.list"
                     :columns="props.tableColumns"
                     :manual="props.manual"
                     v-model:defaultParams="searchParams">
            <template v-for="column in props.tableColumns"
                      :key="column.dataIndex"
                      #[column.slot]="{ record }">
              <!--     注入修改操作     -->
              <rest-edit v-if="column.slot === 'edit' && props.uris.update"
                         @click="edit(record, column.dataIndex)"
                         :value="formatRecordValue(record, column)">
              </rest-edit>
              <!--    注册删除操作    -->
              <span v-else-if="column.slot === 'action'">
              <!--    如果操作里有其它按钮，也注入插槽      -->
              <template v-for="item in column.options?.slots" :key="item">
                <slot :name="item" :record="record"></slot>
              </template>
              <VAPopconfirm v-if="props.uris?.delete"
                          title="删除策略"
                          label="删除"
                          labelColor="#DC143C"
                          placeholder="确定删除吗？"
                          @on-ok="remove(record)">
              </VAPopconfirm>
              </span>
              <!--   注入插槽     -->
              <slot v-else-if="column.slot"
                    :name="column.slot"
                    :record="record">
              </slot>
            </template>
          </v-a-table>
        </div>
      </div>
    </div>
    <!--  嵌入添加和修改表单  -->
    <VAFormDrawer v-if="props.formOptions?.length > 0 && (props.uris?.create || props.uris?.update)"
                  v-model:visible="visible"
                  :title="title"
                  :data="data"
                  :options="props.formOptions"
                  @close="cancel"
                  @submit="formSubmit">
      <template #extra>
        <slot name="extra"></slot>
      </template>
      <template v-for="v in props.formOptions" #[v.slot]="{item, data}">
        <slot v-if="v.slot" :name="v.slot" :item="item" :data="data"></slot>
      </template>
    </VAFormDrawer>
  </div>
</template>
<script lang="ts" setup>
import VASearch from "../VASearch/VASearch.vue"
import VATable from "../VATable/VATable.vue"
import VAFormDrawer from "../VAFormDrawer/VAFormDrawer.vue"
import VAPopconfirm from "../VAPopconfirm/VAPopconfirm.vue";
import RestEdit from "./components/RestEdit.vue"
import propsOptions from './extends/props'
import {defineEmits, defineProps, defineExpose, ref, computed} from "vue";
import {useFormDrawer, useTableRef} from "./extends/hooks";
import {VAFormItem} from "../VAForm/extends/typing";
import {formatRecordValue} from "../VATable/extends/hooks";
import {PlusOutlined} from '@ant-design/icons-vue';
import VABreadcrumb from "../VABreadcrumb/VABreadcrumb.vue";
import {KeyValueType, RestfulUris} from "../../typing";

const emit = defineEmits(['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete'])

const props = defineProps(propsOptions)

const searchParams = ref(props.searchDefaultParams || {})

const onSearch = (value: any = {}) => {
  // 如果默认搜索和搜索都有query类型，则把query合并，避免冲突
  if ('query' in value && 'query' in props.searchDefaultParams) {
    value['query'] = [...value.query, ...props.searchDefaultParams['query']]
  }
  searchParams.value = {...searchParams.value, ...value}
  reload(searchParams.value)
}

const {table, reload, remove} = useTableRef(props.uris as RestfulUris, props.searchDefaultParams, emit)

const {
  visible, title, data, edit, add, cancel, submit
} = useFormDrawer(props.formOptions as Array<VAFormItem>, props.formDefaultParams as KeyValueType)

const formSubmit = (params: any) => {
  submit(params, emit, props.uris as RestfulUris, onSearch)
}

const selectedRowKeys = computed(()=>{
  return table.value.selectedRowKeys
})

defineExpose({onSearch, selectedRowKeys, data, visible, reload})

</script>

<style scoped>
.va-rest {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.va-rest-main {
  background: white;
  padding: 20px 20px 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-bottom: 15px;
}

.va-rest-header {
  margin-bottom: 10px;
  display: inline-flex;
}

.va-rest-body {
  flex: 1;
  position: relative;
  min-height: 0;
}

.va-rest-add {
  position: absolute;
  right: 40px;
  z-index: 999;
  top: -34px;
}

.va-rest-table {
  height: 100%;
}
</style>
