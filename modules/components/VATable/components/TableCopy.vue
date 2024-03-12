<template>
  <span>
    <a @click="copy">
      {{value}}
          <copy-outlined/>
    </a>
  </span>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";
import {CopyOutlined} from "@ant-design/icons-vue"
import useClipboard from "vue-clipboard3";
import {notify} from "@kyvg/vue3-notification";

const props = defineProps({
  value: {
    type: String,
    required: true
  },
})

const { toClipboard } = useClipboard();
const copy = async () => {
  try {
    // 复制
    await toClipboard(props.value);

  } catch (e) {
    notify({text: '复制失败', type: 'error'})
  }
};
</script>

<style scoped>

</style>
