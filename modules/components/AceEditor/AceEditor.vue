<template>
  <v-ace-editor
    :value="value"
    :lang="options.mode || 'javascript'"
    :theme="options.theme || 'monokai'"
    :style="`height:${options.height || '200px'}`"
    :wrap="true"
  />
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType, onMounted } from 'vue';
import { AceEditorOptions } from './typing';
import { VAceEditor } from 'vue3-ace-editor';
import 'brace/mode/javascript';
import 'brace/mode/markdown';
import 'brace/mode/text';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/chrome';
import 'brace/theme/eclipse';
import 'brace/theme/sqlserver';
import 'brace/theme/twilight';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },

  options: {
    type: Object as PropType<AceEditorOptions>,
    default: () => {
      return {
        mode: 'javascript',
        theme: 'monokai',
        height: '200px',
      };
    },
  },
  disabled: {
    type: Boolean,
  },
  placeholder: {
    type: String,
  },
});
</script>

<style>
.ace-monokai .ace_print-margin {
  width: 0 !important;
}
</style>
