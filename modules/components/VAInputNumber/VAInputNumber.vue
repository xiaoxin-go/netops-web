<template>
  <a-input-number :value="value"
                  :disabled="disabled"
                  :placeholder="placeholder"
                  @change="change"
  />
</template>

<script setup lang="ts">

import {defineEmits, defineProps} from "vue";

const emit = defineEmits(["update:value"])

defineProps({
  value: {
    type: Number,
    required: true
  },
  disabled: {
    type: Boolean
  },
  placeholder: {
    type: String
  }
})

const change = (value: number) =>{
  emit("update:value", value)
}

</script>

<style scoped>

</style>
