<template>
  <a-breadcrumb style="margin: 10px 0; font-size: 13px">
    <template v-for="item in options"
              :key="item.label">
      <a-breadcrumb-item v-if="item.name">
        <a @click="go(item)" class="va-breadcrumb-to" :style="`color: ${item.color}`">{{ item.label }}</a>
      </a-breadcrumb-item>
      <a-breadcrumb-item :style="`color: ${item.color}`" v-else>{{ item.label }}</a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import {defineProps, PropType} from "vue";
import {useRouter} from "vue-router";
import {VABreadcrumbItem} from "./typings";

const router = useRouter()

defineProps({
  options: {
    type: Array as PropType<Array<VABreadcrumbItem>>
  }
})

const go = (item: VABreadcrumbItem) => {
    router.push({name: item.name, query: {...item.query || {}}})
}

</script>

<style scoped>
.va-breadcrumb-to{
  color: #3d3dd0b3;
}
.va-breadcrumb-to:hover{
  color: #4949ea;
}
</style>
