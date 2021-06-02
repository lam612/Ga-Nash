<template>
  <div class="chart-body">
    <BaseLineChartsass
      :ref="chartId"
      :chart-data="chartData"
      :title="chartName"
      :styles="styles"
      :options="options"
      :chart-id="chartId"
    />
  </div>
</template>
<script>
import XLSX from 'xlsx'
import BaseLineChartsass from '~/components/baseChart/BaseLineChart'

export default {
  name: 'LineChart',
  components: {
    BaseLineChartsass,
  },
  props: {
    chartId: {
      type: String,
      default: 'id',
    },
    chartName: {
      type: String,
      default: 'data',
    },
    chartData: {
      type: Object,
      default() {
        return {}
      },
    },
    styles: {
      type: Object,
      default() {
        return {}
      },
    },
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    transpose: {
      type: Boolean,
      default: false,
    },
    chartAction: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    jsonToExcelData(dataset) {
      const excelHeader = [''].concat(dataset.labels)
      const excelData = dataset.datasets.map((e) => {
        return [e.label, ...e.data]
      })
      return [excelHeader, ...excelData]
    },
    chartToImg() {
      if (this.chartId !== 'id') {
        const canvas = document
          .getElementById(this.chartId)
          .toDataURL('image/png')
        const link = document.createElement('a')
        link.download = this.chartName
        link.href = canvas
        link.click()
      }
    },
    chartToExcel() {
      const aoa = []
      const excelData = this.jsonToExcelData(this.chartData)
      if (this.transpose) {
        for (let i = 0; i < excelData.length; ++i) {
          for (let j = 0; j < excelData[i].length; ++j) {
            if (!aoa[j]) aoa[j] = []
            aoa[j][i] = excelData[i][j]
          }
        }
      }
      const chartlWS = this.transpose
        ? XLSX.utils.aoa_to_sheet(aoa)
        : XLSX.utils.aoa_to_sheet(excelData)

      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, chartlWS, this.chartName)

      XLSX.writeFile(wb, this.chartName + '.xlsx')
    },
  },
}
</script>

<style scoped>
.chart-body {
  display: block;
  position: relative;
}
.chart-body:hover .chart-action {
  opacity: 1;
}
.chart-action {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: rgb(250, 250, 250);
  border-radius: 4px;
}
</style>
