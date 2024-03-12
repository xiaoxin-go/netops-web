<template>
  <a-form
    :model="source"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 18 }"
    ref="formRef"
    :rules="rules"
  >
    <a-form-item
      v-for="item in options"
      :key="item.label"
      :label="item.label"
      :name="item.key"
      :ref="item.key"
    >
      <slot v-if="item.slot" :item="item" :name="item.slot" :data="source">
      </slot>
      <!--   为了简化框架和提高性能, 只支持一些简单的组件, 复杂的组件可自定义使用插槽   -->
      <template v-else-if="item.tagType in components">
        <component
          v-if="item.change"
          :is="components[item.tagType]"
          v-model:value="source[item.key]"
          size="small"
          :width="item.width || '100%'"
          :options="item.options"
          :placeholder="item.placeholder || '请输入' + item.label"
          :disabled="item.disabled"
          @on-change="item.change($event, source)"
        >
        </component>
        <component
          v-else
          :is="components[item.tagType]"
          v-model:value="source[item.key]"
          size="small"
          :width="item.width || '100%'"
          :options="item.options"
          :placeholder="item.placeholder || '请输入' + item.label"
          :disabled="item.disabled"
        >
        </component>
      </template>
      <a-input
        v-else
        v-model:value="source[item.key]"
        size="small"
        :type="item.options?.type || 'text'"
        :disabled="item.disabled"
        :width="item.width || '100%'"
        :placeholder="item.placeholder || '请输入' + item.label"
        :suffix="item.options?.suffix"
        :prefix="item.options?.prefix"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType, defineExpose, ref } from 'vue';
import { VAFormItem } from './extends/typing';
import VASelect from '../VASelect/VASelect';
import VASelectCascade from '../VASelectCascade/VASelectCascade';
import VASwitch from '../VASwitch/VASwitch.vue';
import VARadioGroup from '../VARadioGroup/VARadioGroup.vue';
import VAInputNumber from '../VAInputNumber/VAInputNumber';
import VATextarea from '../VATextarea/VATextarea';
import Cascader from '../VACascader/VACascader';
import JsonEditor from '../JsonEditor/JsonEditor';
import AceEditor from '../AceEditor/AceEditor';

const formRef = ref(null);

const components = {
  select: VASelect,
  'select-cascade': VASelectCascade,
  switch: VASwitch,
  'radio-group': VARadioGroup,
  'input-number': VAInputNumber,
  textarea: VATextarea,
  cascader: Cascader,
  'json-editor': JsonEditor,
  'ace-editor': AceEditor,
};

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  options: {
    type: Array as PropType<Array<VAFormItem>>,
    required: true,
    default: () => {
      return [];
    },
  },
});
const source = computed(() => props.data);

const rules = computed(() => {
  const data: {
    [key in string]: Array<{ required: boolean; message: string }>;
  } = {};
  props.options.forEach((item) => {
    if (item.required)
      data[item.key] = [{ required: true, message: `${item.label}不能为空` }];
  });
  return data;
});

defineExpose({
  source,
  formRef,
});
</script>

<style scoped></style>
