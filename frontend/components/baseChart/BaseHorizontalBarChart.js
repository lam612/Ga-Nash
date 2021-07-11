import 'chartjs-plugin-colorschemes'
import { HorizontalBar, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins
export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: {
    chartData: Object,
    title: String,
    options: Object,
  },
  data() {
    return {
      final_options: {},
      default_options: {
        tooltips: {},
        plugins: {
          colorschemes: {
            scheme: 'brewer.SetOne9',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
              ticks: {
                precision: 0,
                beginAtZero: true,
                fontSize: 15,
              },
              type: 'linear',
            },
          ],
        },
        legend: {
          position: 'bottom',
        },
        barPercentage: 1,
      },
    }
  },
  watch: {
    chartData() {
      this._data._chart.destroy()
      this.forceRender()
    },
  },
  mounted() {
    this.forceRender()
  },
  methods: {
    forceRender() {
      const tooltipOptions = {
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 15,
          displayColors: false,
          titleAlign: 'center',
          callbacks: {
            mode: 'y',
            title: (item, { labels }) => {
              return labels[item[0].index]
            },
            label: (item, data) => {
              return `${data.datasets[item.datasetIndex].label} : ${
                data.datasets[item.datasetIndex].data[item.index]
              }`
            },
          },
        },
      }
      let titleOption = {}
      if (this.title) {
        titleOption = {
          title: {
            display: true,
            fontSize: 18,
            text: this.title,
          },
        }
      }
      Object.assign(
        this.final_options,
        this.default_options,
        tooltipOptions,
        titleOption,
        this.options
      )
      this.renderChart(this.chartData, this.final_options)
    },
  },
}
