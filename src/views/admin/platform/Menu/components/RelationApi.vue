<template>
  <a-drawer title="关联接口" :open="visible" width="calc(50% + 100px)" @close="cancel">
    <a-transfer
        v-model:target-keys="targetKeys"
        show-search
        :data-source="dataSource"
        :render="item => item.title"
        :pagination="{pageSize: 20}"
    />
    <template #footer>
      <a-button size="small" style="margin-right: 10px" type="primary" @click="submit({menu_id: menuId, api_ids: targetKeys})">提交</a-button>
      <a-button size="small" @click="cancel">取消</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {useOperate, useRequest} from "@/utils/hooks";
import {APIUri} from "@/api";
import {defineEmits, defineProps, watch} from "vue";

const props = defineProps({
  menuId: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible'])

const cancel = () =>{
  emit('update:visible', false)
}

const {data: dataSource} = useRequest(APIUri.Api.restful.list, {size: 999}, {
  format: (data: any)=> data.map((item: any)=>{
    return {key: item.id, title: `${item.name}(${item.uri})`}
  })
})

const submit = useOperate(APIUri.Menu.relationApi, {}, ()=>{
  cancel()
})

const {data: targetKeys, run: getRelationApiIds} = useRequest(APIUri.Menu.getRelationApiIds, {}, {
  manual: true, default: []
})

watch(()=>props.visible, (value)=>{
  if (value){
    getRelationApiIds({menu_id: props.menuId})
  }
})

</script>

<style scoped>

</style>
