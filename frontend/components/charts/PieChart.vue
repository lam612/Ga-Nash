<template>
  <div class="chart-body">
    <BasePieChart
      :ref="chartId"
      :chart-data="chartData"
      :title="chartName"
      :styles="styles"
      :options="chartOptions"
      :chart-id="chartId"
    />
    <div class="chart-action">
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
import BasePieChart from '~/components/baseChart/BasePieChart'

export default {
  name: 'PieChart',
  components: {
    BasePieChart,
  },
  props: {
    chartId: {
      type: String,
      default() {
        return Math.random().toString(36).substring(3)
      },
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
        return {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            fontSize: 18,
            text: 'VMI',
          },
          legend: {
            position: 'top',
          },
        }
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
      chartOptions: {},
    }
  },
  created() {
    this.chartOptions = this.options
    this.chartOptions.title.text = this.chartName
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
      const canvas = document
        .getElementById(this.chartId)
        .toDataURL('image/png')
      const link = document.createElement('a')
      link.download = this.chartName
      link.href = canvas
      link.click()
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
  padding: 15px;
}
.chart-body:hover {
  background-color: rgba(245, 241, 241, 0.527);
  border-radius: 12px;
}
.chart-body:hover .chart-action {
  opacity: 1;
}
.chart-action {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: rgb(250, 250, 250);
  border-radius: 4px;
}
</style>
