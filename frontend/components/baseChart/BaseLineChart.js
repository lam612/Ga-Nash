import 'chartjs-plugin-colorschemes'
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    title: String,
    options: Object,
  },
  data() {
    return {
      final_options: {},
      default_options: {
        title: {
          display: true,
          text: this.title,
        },
        plugins: {
          colorschemes: {
            scheme: 'brewer.SetOne9',
          },
        },
        // responsive: true,
        // maintainAspectRatio: false
      },
    }
  },
  mounted() {
    Object.assign(this.final_options, this.default_options, this.options)
    this.renderChart(this.chartData, this.final_options)
  },
  methods: {
    forceRender() {
      this.renderChart(this.chartData, this.final_options)
    },
  },
}
