<template>
  <a-textarea v-model:value="content"
              :disabled="disabled"
              :placeholder="placeholder"
              :rows="4"
  />
</template>

<script setup lang="ts">

import {defineEmits, defineProps, ref, watch} from "vue";

const emit = defineEmits(["update:value"])

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean
  },
  placeholder: {
    type: String
  }
})
const content = ref(props.value)
watch(() => content.value, (val) => {
  emit("update:value", val)
})
</script>

<style scoped>

</style>
