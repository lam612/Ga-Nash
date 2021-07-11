<template>
  <v-container fluid>
    <div>
      <!-- VMI INPUT FORM -->
      <div class="model-form">
        <h3 class="model-title">VMI</h3>
        <v-form ref="form" lazy-validation>
          <v-combobox
            v-model="vmiId"
            :rules="vmiIdRules"
            :items="vmiIdList"
            label="VMI ID"
            :loading="dialog"
            required
          ></v-combobox>
        </v-form>
        <v-btn color="error" @click="getVMI">Submit</v-btn>
        <v-dialog v-model="confirmResetVmi" persistent max-width="450">
          <template #activator="{ on, attrs }">
            <v-btn
              color="light-blue"
              class="white--text"
              v-bind="attrs"
              v-on="on"
              >Reset</v-btn
            >
          </template>
          <v-card>
            <v-card-title class="text-h5">
              Are you sure to reset VMI Strategy ?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="confirmResetVmi = false"
              >
                cancel
              </v-btn>
              <v-btn color="green darken-1" text @click="resetVMI"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <!-- END VMI INPUT FORM -->

      <!-- VMI Chart -->
      <v-container class="model-chart">
        <v-row justify="center" text-align="center">
          <!-- 「Nash GA」 VMI Strategy Result -->
          <v-col cols="12" md="6" lg="3" class="pa-0 my-2">
            <div>
              <v-data-table
                v-if="desserts.vmiStg.length > 0"
                dense
                :headers="headers.vmiStg"
                :items="desserts.vmiStg"
                class="elevation-1"
                :hide-default-footer="true"
              ></v-data-table>
            </div>
          </v-col>
        </v-row>
        <v-row justify="center" text-align="center">
          <!-- 「Nash GA」 Profit Chart -->
          <v-col cols="12" md="9" lg="6" class="pa-0 my-2">
            <div v-if="!!profitChartData">
              <LineChart
                chart-name="Nash-GA Profit"
                :chart-data="profitChartData"
                :transpose="true"
              />
            </div>
          </v-col>

          <!-- 「Nash GA」 Profit Chart -->
          <v-col cols="12" md="9" lg="6" class="pa-0 my-2">
            <div v-if="!!fitnessChartData">
              <LineChart
                chart-name="Nash-GA Fitness"
                :chart-data="fitnessChartData"
                :transpose="true"
              />
            </div>
          </v-col>

          <!-- 「Nash Optimal」Profit Pie Chart -->
          <v-col cols="12" md="9" lg="6" class="pa-0 my-2">
            <div v-if="!!profitPieChartData">
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
      // 10b98
      // 79772
      // defcf
      // fea8e
      vmiId: '',
      vmiIdList: [],
      vmiInfo: {},
      vmiStra: {},
      nashGaLog: null,
      nashOptimal: null,
      dialog: false,
      confirmResetVmi: false,
      vmiIdRules: [
        (v) => !!v || 'ID is required',
        (v) => (v && v.length >= 5) || 'Invalid Vmi ID',
      ],
      playerColor: ['#36F1CD', '#F46036', '#019dff', '#F4E04D', '#324376'],
      profitChartData: null,
      fitnessChartData: null,
      profitPieChartData: null,
      headers: {
        vmiStg: [
          {
            text: 'Variable Name',
            align: 'center',
            filterable: false,
            groupable: false,
            value: 'name',
          },
          {
            text: 'Value',
            align: 'center',
            filterable: false,
            value: 'value',
          },
        ],
        vmiCost: [
          {
            text: 'Name',
            align: 'center',
            filterable: false,
            groupable: false,
            value: 'name',
          },
          {
            text: 'Cost type',
            align: 'center',
            value: 'type',
          },
          {
            text: 'Value',
            align: 'right',
            filterable: false,
            value: 'value',
          },
        ],
      },
      desserts: {
        vmiStg: [],
        vmiCost: [],
      },
      vmiStgData: {
        A: [],
        cp: [],
        a: [],
      },
      vmiCostData: {},
    }
  },
  created() {
    this.vmiIdList = JSON.parse(localStorage.getItem('vmiIds')) || []
  },
  mounted() {},
  methods: {
    resetVMI() {
      const querystring =
        process.env.RESET_VMI_API_URL + '?vmi_id=' + this.vmiId
      this.$axios.$get(querystring).then((res) => {
        console.log(res)
      })
      this.confirmResetVmi = false
    },
    getVMI() {
      if (this.$refs.form.validate()) {
        if (!this.vmiIdList.includes(this.vmiId)) {
          this.vmiIdList.push(this.vmiId)
          localStorage.setItem('vmiIds', JSON.stringify(this.vmiIdList))
        }
        this.dialog = true
        // VMI ID
        // 60529
        // bdd08
        // defcf
        const querystring =
          process.env.GET_VMI_API_URL + '?vmi_id=' + this.vmiId
        this.$axios
          .$get(querystring)
          .then((res) => {
            // Mock API
            // res = this.mockData
            // this.nashGaLog = res.nash_ga_log
            // this.nashOptimal = res.nash_strategy
            // this.vmiInfo.retailerCount = Object.keys(
            //   res.vmi_val.retailer
            // ).length
            // this.vmiInfo.playerCount = this.vmiInfo.retailerCount + 1
            // this.vmiInfo.nashGaStep = this.nashGaLog.length
            // this.dialog = false

            this.nashGaLog = res.nash_ga_log
            this.nashOptimal = res.nash_strategy
            this.vmiStgData.A = this.nashOptimal.A
            this.vmiStgData.cp = this.nashOptimal.cp
            this.vmiStgData.a = this.nashOptimal.a
            this.vmiCostData = this.nashOptimal.cost
            this.vmiInfo.retailerCount = Object.keys(
              res.vmi_val.retailer
            ).length
            this.vmiInfo.playerCount = this.vmiInfo.retailerCount + 1
            this.vmiInfo.nashGaStep = this.nashGaLog.length
            this.dialog = false
          })
          .then((_) => {
            this.getVmiStrategy()

            // Get「Nash GA」 Profit & Fitness Chart Dataset
            this.calcNashGADatasets()

            // Get Profit Pie Chart Dataset
            this.calcNashGaOptDatasets()
          })
      }
    },
    // VMI Strategy
    getVmiStrategy() {
      this.desserts.vmiStg = []
      for (const valName in this.vmiStgData) {
        this.vmiStgData[valName].forEach((value, idx) => {
          const vmiStgItem = {
            name: valName + ' ' + (idx + 1),
            value,
          }
          this.desserts.vmiStg.push(vmiStgItem)
        })
      }
    },

    // VMI Cost
    getVmiCost() {
      this.desserts.vmiCost = []
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
          pointBackgroundColor: 'white',
          type: 'line',
          borderWidth: 2.5,
          pointRadius: 3,
          lineTension: 0.3,
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
  margin: 1.5rem auto;
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
