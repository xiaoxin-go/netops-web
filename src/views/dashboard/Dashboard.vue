<template>
  <div id="dashboard">
    <div style="margin-bottom: 20px; margin-top: 20px">
      <a-card
        title="工单执行总数"
        style="display: inline-block; width: 200px; margin-right: 15px"
      >
        {{ workorderCount?.count }}
      </a-card>
      <a-card title="策略执行总数" style="display: inline-block; width: 200px">
        {{ workorderExecCount?.count }}
      </a-card>
    </div>
    <div>
      <a-card
        title="每月工单执行统计"
        style="
          margin-right: 20px;
          box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          width: 550px;
          display: inline-block;
        "
      >
        <template #extra><a href="#">more</a></template>
        <vue-echarts
          :option="yearLineChartOption"
          style="height: 300px"
          ref="chart"
        ></vue-echarts>
      </a-card>
      <a-card
        title="当前属地执行工单统计"
        style="
          margin-right: 20px;
          box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          width: 550px;
          display: inline-block;
        "
      >
        <template #extra><a href="#">more</a></template>
        <vue-echarts
          :option="regionColumnChartOption"
          style="height: 300px"
          ref="chart"
        ></vue-echarts>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { APIUri, get } from '@/api'
import { useRequest } from 'vue-request'
import { VueEcharts } from 'vue3-echarts'

const { data: workorderCount } = useRequest(get, {
  formatResult: (res) => res.data,
  defaultParams: [APIUri.workorderCount],
})
const { data: workorderExecCount } = useRequest(get, {
  formatResult: (res) => res.data,
  defaultParams: [APIUri.workorderExecCount],
})
const { data: workorderYearLineChart, run: getWorkorderYearLineChart } =
  useRequest(get, {
    formatResult: (res) => res.data,
    defaultParams: [APIUri.workorderYearLineChart, { year: 2021 }],
  })
const { data: workorderRegionColumnChart, run: getWorkorderRegionColumnChart } =
  useRequest(get, {
    formatResult: (res) => res.data,
    defaultParams: [APIUri.workorderRegionColumnChart, { year: 2021 }],
  })
const yearLineChartOption = computed(() => {
  return {
    title: {
      show: false,
      text: '每月工单执行统计',
    },
    tooltip: {},
    xAxis: {
      data: workorderYearLineChart.value?.map((item: any) => item.month),
    },
    yAxis: {},
    series: [
      {
        name: '任务数量',
        type: 'bar',
        data: workorderYearLineChart.value?.map((item: any) => item.count),
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  }
})
const regionColumnChartOption = computed(() => {
  return {
    title: {
      show: false,
      text: '当年属地执行工单统计',
    },
    tooltip: {},
    xAxis: {
      data: workorderRegionColumnChart.value?.map((item: any) => item.region),
    },
    yAxis: {},
    series: [
      {
        name: '任务数量',
        type: 'bar',
        data: workorderRegionColumnChart.value?.map((item: any) => item.count),
      },
    ],
  }
})
</script>
<style scoped></style>
