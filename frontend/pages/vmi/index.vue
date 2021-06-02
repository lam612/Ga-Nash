<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">VMI</h1>
      <LineChart
        chart-name="Demand"
        :chart-data="lineData"
        :options="lineOption"
        :transpose="true"
      />
    </div>
  </div>
</template>

<script>
import LineChart from '~/components/charts/LineChart'

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      lineOption: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          fontSize: 18,
          text: 'Profit Chart',
        },
        width: '100%',
        minWidth: '500px',
      },
      profitDS: {},
      lineData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'transparent',
            borderColor: 'rgb(255, 99, 132)',
            data: [10, 20, 15, 25, 45, 70, 115, 185, 70, 75, 70, 60],
          },
        ],
      },
    }
  },
  created() {
    this.getDatasets()
  },
  mounted() {},
  methods: {
    getDatasets() {
      const querystring =
        process.env.GET_VMI_API_URL +
        '?vmi_id=' +
        '9b5356359d4a53aaff670168e66a9035'
      const config = {
        headers: { 'Content-Type': 'application/json' },
      }
      this.$axios.$get(querystring, config).then((res) => {
        this.profitDS = res.nash_ga_log
        this.calcProfitDatasets()
      })
    },
    calcProfitDatasets() {},
  },
}
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  margin-top: 40px;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
