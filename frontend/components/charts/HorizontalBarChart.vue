<template>
  <div class="chart-body">
    <BaseHorizontalBarChart
      :ref="chartId"
      :chart-data="chartData"
      :title="chartName"
      :styles="styles"
      :options="options"
      :chart-id="chartId"
    />
    <div v-if="chartAction" class="chart-action" absolute>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="primary"
            dark
            icon
            v-on="on"
            @click="chartToImg"
          >
            <v-icon> mdi-cloud-download </v-icon>
          </v-btn>
        </template>
        <span>Download chart</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="primary"
            dark
            icon
            v-on="on"
            @click="chartToExcel"
          >
            <v-icon> mdi-file-chart </v-icon>
          </v-btn>
        </template>
        <span>Get Data</span>
      </v-tooltip>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import BaseHorizontalBarChart from '~/components/baseChart/BaseHorizontalBarChart'

export default {
  name: 'HorizontalChart',
  components: {
    BaseHorizontalBarChart,
  },
  props: {
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
        return {
          width: '90%',
          maxWidth: '1250px',
          height: '100%',
          minHeight: '350px',
          margin: 'auto',
        }
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
  data() {
    return {
      chartId: '',
    }
  },
  created() {
    this.chartId = Math.random().toString(36).substring(7) + Date.now()
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

<style lang="scss" scoped>
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
