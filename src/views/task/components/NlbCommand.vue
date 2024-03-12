<template>
  <Codemirror
      :value="value"
      :options="cmOptions"
      border
      width="100%"
  >
  </Codemirror>
</template>


<script setup lang="ts">
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/monokai.css'
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/addon/display/autorefresh';
import {EditorConfiguration} from 'codemirror';
import {defineProps, ref} from "vue";

defineProps({
  value: String,
})

const cmOptions: EditorConfiguration = {
  mode: 'application/json',
  theme: 'monokai',
  lineWrapping: true,
  autocorrect: true,
  smartIndent: true,
  autofocus: true,
  autoRefresh: true,
  autocapitalize: true,
};

</script>

<style scoped>

</style>
