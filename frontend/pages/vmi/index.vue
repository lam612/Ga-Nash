<template>
  <v-container fluid>
    <div>
      <!-- VMI INPUT FORM -->
      <div class="model-form">
        <h3 class="model-title">VMI</h3>
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="vmiId"
            :rules="vmiIdRules"
            label="VMI ID"
            required
          ></v-text-field>
        </v-form>
        <v-btn color="error" @click="getVMI">Submit</v-btn>
      </div>
      <!-- END VMI INPUT FORM -->

      <!-- VMI Chart -->
      <v-container class="model-chart">
        <v-row justify="center" text-align="center">
          <!-- 「Nash GA」 Profit Chart -->
          <v-col cols="12" md="9" lg="6">
            <div v-if="!!profitChartData || true">
              <LineChart
                chart-name="Nash-GA Profit"
                :chart-data="profitChartData"
                :transpose="true"
              />
            </div>
          </v-col>

          <!-- 「Nash GA」 Profit Chart -->
          <v-col cols="12" md="9" lg="6">
            <div v-if="!!fitnessChartData || true">
              <LineChart
                chart-name="Nash-GA Fitness"
                :chart-data="fitnessChartData"
                :transpose="true"
              />
            </div>
          </v-col>

          <!-- 「Nash Optimal」Profit Pie Chart -->
          <v-col cols="12" md="9" lg="6">
            <div v-if="!!profitPieChartData || true">
              <PieChart
                chart-name="VMI Profit"
                :chart-data="profitPieChartData"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Loader Dialog -->
      <v-dialog v-model="dialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Loading VMI...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import LineChart from '~/components/charts/LineChart'
import PieChart from '~/components/charts/PieChart'

export default {
  components: {
    LineChart,
    PieChart,
  },
  data() {
    return {
      vmiId: '9b5356359d4a53aaff670168e66a9035',
      vmiInfo: {},
      nashGaLog: null,
      nashOptimal: null,
      dialog: false,
      vmiIdRules: [
        (v) => !!v || 'ID is required',
        (v) => (v && v.length >= 20) || 'Invalid Vmi ID',
      ],
      playerColor: ['#36F1CD', '#F46036', '#019dff', '#F4E04D', '#324376'],
      profitChartData: {},
      fitnessChartData: {},
      profitPieChartData: {},
      mockData: {
        status: 'SUCCEED',
        vmi_val: {
          retailer: {
            r1: {
              id: 'r1',
              K: 32000,
              uc: 10,
              A: 0,
              a: 0,
              cp: 0,
              p: 2100,
              S_b: 500000,
              H_b: 25,
              L_b: 800000,
              b_rate: 0.05,
              T_b: 35,
            },
            r2: {
              id: 'r2',
              K: 28000,
              uc: 15,
              A: 0,
              a: 0,
              cp: 0,
              p: 2100,
              S_b: 600000,
              H_b: 32,
              L_b: 1000000,
              b_rate: 0.05,
              T_b: 35,
            },
            r3: {
              id: 'r3',
              K: 24000,
              uc: 20,
              A: 0,
              a: 0,
              cp: 0,
              p: 2100,
              S_b: 700000,
              H_b: 36,
              L_b: 1200000,
              b_rate: 0.05,
              T_b: 45,
            },
          },
          manufacturer: {
            materials: {
              mt1: {
                id: 'mt1',
                cr: 1280,
                M: 1,
                H_r: 6,
                T_r: 1,
                S_r: 500000,
                n: 5,
              },
              mt2: {
                id: 'mt2',
                cr: 8,
                M: 1,
                H_r: 6,
                T_r: 1,
                S_r: 3,
                n: 1,
              },
              mt3: {
                id: 'mt3',
                cr: 18,
                M: 1,
                H_r: 6,
                T_r: 1,
                S_r: 24000,
                n: 1,
              },
            },
            transport: {
              S_p: 500000,
              H_p: 10,
              T_p: 20,
            },
            product: {
              p: 2100,
              P: 200000,
              M_p: 92,
              M_s: 10,
              C: 1,
            },
            info: {
              r_ids: ['r1', 'r2', 'r3'],
              NUM_OF_MATERIALS: 3,
              NUM_OF_RETAILERS: 3,
            },
          },
          ga: {
            generation_number: 30,
            population_size: 100,
            selection_rate: 0.85,
            crossover_rate: 0.5,
            mutation_rate: 0.05,
            MAX_A: 180,
            MAX_a: 120,
          },
          nash: {
            weight: {
              p0: [0.45, 0.22, 0.18, 0.15],
              p1: [0.36, 0.32, 0.16, 0.16],
              p2: [0.36, 0.16, 0.32, 0.16],
              p3: [0.36, 0.16, 0.16, 0.32],
            },
            mf_id: 'p0',
            beta: 0.016,
          },
        },
        nash_strategy: {
          A: 164,
          cp: [1932, 1871, 1960],
          a: [78, 51, 70],
          fitness: [9363152, 7897799, 8221019, 7767543],
          demand: [25470, 24894, 24470],
          profit: [17779922, 2037600, 4057722, 1223500],
        },
        nash_ga_log: [
          {
            A: 74,
            cp: [1621, 1370, 1468],
            a: [118, 73, 28],
            fitness: [2631764, 3858344, 5032135, 4392000],
            demand: [21398, 23126, 18572],
            profit: [-7377637, 7510698, 14846892, 10846048],
          },
          {
            A: 174,
            cp: [1957, 1978, 1828],
            a: [119, 105, 119],
            fitness: [9855331, 8109602, 8053692, 8709498],
            demand: [28912, 27666, 31234],
            profit: [20296010, 404768, 55332, 4154122],
          },
          {
            A: 173,
            cp: [1991, 1858, 1901],
            a: [66, 68, 35],
            fitness: [9231108, 7714373, 8279991, 8149266],
            demand: [24879, 27397, 24577],
            profit: [17190047, 821007, 4356123, 3539088],
          },
          {
            A: 179,
            cp: [1952, 1956, 1984],
            a: [75, 44, 51],
            fitness: [10132660, 8429341, 8497083, 8336867],
            demand: [26949, 24955, 24885],
            profit: [20465249, 1697787, 2121175, 1119825],
          },
          {
            A: 176,
            cp: [1975, 1873, 1952],
            a: [57, 55, 58],
            fitness: [9619819, 8043280, 8482507, 8096638],
            demand: [25014, 26726, 25490],
            profit: [18394931, 1450812, 4195982, 1784300],
          },
          {
            A: 156,
            cp: [1976, 1853, 1992],
            a: [66, 42, 57],
            fitness: [9144160, 7572268, 8113581, 7505909],
            demand: [22854, 23580, 22008],
            profit: [17764552, 1096992, 4480200, 682248],
          },
          {
            A: 173,
            cp: [1837, 1951, 1988],
            a: [99, 71, 97],
            fitness: [9956641, 8644619, 8174048, 7891401],
            demand: [29697, 25909, 26855],
            profit: [19281868, 4573338, 1632267, -134275],
          },
          {
            A: 169,
            cp: [1934, 1978, 1983],
            a: [43, 64, 69],
            fitness: [9960149, 8402105, 8137497, 8079805],
            demand: [23939, 24449, 24669],
            profit: [20160401, 2705107, 1051307, 690732],
          },
          {
            A: 174,
            cp: [1986, 1961, 1836],
            a: [69, 75, 74],
            fitness: [9538583, 7971240, 8034334, 8599376],
            demand: [25290, 26112, 28300],
            profit: [18648650, 885150, 1279488, 4811000],
          },
          {
            A: 173,
            cp: [1921, 1955, 1962],
            a: [72, 64, 36],
            fitness: [9758901, 8281466, 8138271, 8178873],
            demand: [26511, 25403, 23541],
            profit: [19115143, 2571567, 1676598, 1930362],
          },
          {
            A: 168,
            cp: [1970, 1854, 1955],
            a: [60, 64, 64],
            fitness: [9407390, 7866354, 8343247, 7875283],
            demand: [24210, 26546, 24728],
            profit: [17919077, 1452600, 4433182, 1508408],
          },
          {
            A: 164,
            cp: [1932, 1871, 1960],
            a: [78, 51, 70],
            fitness: [9363152, 7897799, 8221019, 7767543],
            demand: [25470, 24894, 24470],
            profit: [17779922, 2037600, 4057722, 1223500],
          },
        ],
      },
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
  created() {},
  mounted() {
    this.getVMI()
  },
  methods: {
    getVMI() {
      if (this.$refs.form.validate()) {
        // this.dialog = true
        // 9b5356359d4a53aaff670168e66a9035
        // const querystring =
        //   process.env.GET_VMI_API_URL + '?vmi_id=' + this.vmiId
        // this.$axios
        //   .$get(querystring)
        //   .then((res) => {
        //     this.nashGaLog = res.nash_ga_log
        //     this.vmiInfo.retailerCount = Object.keys(
        //       res.vmi_val.retailer
        //     ).length
        //     this.vmiInfo.playerCount = this.vmiInfo.retailerCount + 1
        //     this.vmiInfo.nashGaStep = this.nashGaLog.length
        //     this.dialog = false
        //   })
        //   .then((_) => {
        //     this.calcProfitDatasets()
        //   })
        const res = this.mockData
        this.nashGaLog = res.nash_ga_log
        this.nashOptimal = res.nash_strategy
        this.vmiInfo.retailerCount = Object.keys(res.vmi_val.retailer).length
        this.vmiInfo.playerCount = this.vmiInfo.retailerCount + 1
        this.vmiInfo.nashGaStep = this.nashGaLog.length
        this.dialog = false

        // Get「Nash GA」 Profit & Fitness Chart Dataset
        this.calcNashGADatasets()

        // Get Profit Pie Chart Dataset
        this.calcNashGaOptDatasets()
      }
    },
    // Profit & Fitness Datasets
    calcNashGADatasets() {
      this.profitChartData = {
        labels: [],
        datasets: [],
      }
      this.fitnessChartData = {
        labels: [],
        datasets: [],
      }
      const playerLabels = [...Array(this.vmiInfo.nashGaStep).keys()]
      this.profitChartData.labels = playerLabels
      this.fitnessChartData.labels = playerLabels
      for (let playerID = 0; playerID < this.vmiInfo.playerCount; playerID++) {
        const playerName =
          playerID > 0 ? 'Retailer ' + playerID : 'Manufacturer'
        const playerColor = this.playerColor[playerID]
        const baseStyle = {
          label: playerName,
          backgroundColor: playerColor,
          borderColor: playerColor,
          pointBorderColor: playerColor,
          type: 'line',
          borderWidth: 2.5,
          pointRadius: 4,
          lineTension: 0.2,
          fill: 'false',
          data: [],
        }
        const baseProfitDatasets = JSON.parse(JSON.stringify(baseStyle))
        const baseFitnessDatasets = JSON.parse(JSON.stringify(baseStyle))
        this.profitChartData.datasets.push(baseProfitDatasets)
        this.fitnessChartData.datasets.push(baseFitnessDatasets)
      }
      this.nashGaLog.forEach((curStepValue) => {
        for (
          let playerID = 0;
          playerID < this.vmiInfo.playerCount;
          playerID++
        ) {
          const curProfitData = curStepValue.profit
          const curFitnessData = curStepValue.fitness

          this.profitChartData.datasets[playerID].data.push(
            curProfitData[playerID]
          )
          this.fitnessChartData.datasets[playerID].data.push(
            curFitnessData[playerID]
          )
        }
        return curStepValue
      })
    },

    // Calculate Optimal Datasets
    calcNashGaOptDatasets() {
      this.profitPieChartData = {
        labels: [],
        datasets: [],
      }
      for (let playerID = 0; playerID < this.vmiInfo.playerCount; playerID++) {
        const playerName =
          playerID > 0 ? 'Retailer ' + playerID : 'Manufacturer'
        this.profitPieChartData.labels.push(playerName)
      }
      const playerColor = this.playerColor.slice(0, this.vmiInfo.playerCount)
      const baseStyle = {
        backgroundColor: playerColor,
        hoverOffset: 4,
        data: this.nashOptimal.profit,
      }
      this.profitPieChartData.datasets.push(baseStyle)
    },
  },
}
</script>
<style scoped>
.model-title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 64px;
  color: #35495e;
  letter-spacing: 1px;
}

.model-form {
  width: 80%;
  max-width: 420px;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
}

.model-chart {
  margin-top: 1.5rem;
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
