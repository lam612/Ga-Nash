<template>
  <v-container fluid justify="center" text-align="center">
    <!-- VMI Chart -->
    <v-container class="model-chart">
      <v-row justify="center" text-align="center">
        <!-- 「Nash GA」 VMI Strategy Result -->
        <v-col cols="12" md="6" lg="3" class="pa-0 ma-2">
          <div v-if="desserts.vmiStg.length > 0">
            <h1 class="font-weight-light mb-2 text-center">Biến quyết định</h1>
            <v-data-table
              dense
              :headers="headers.vmiStg"
              :items="desserts.vmiStg"
              class="elevation-1"
              :hide-default-footer="true"
            ></v-data-table>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="pa-0 ma-2">
          <div v-if="desserts.vmiCost.length > 0">
            <h1 class="font-weight-light mb-2 text-center">Chi phí mô hình</h1>
            <v-data-table
              dense
              :headers="headers.vmiCost"
              :items="desserts.vmiCost"
              class="elevation-1"
              :hide-default-footer="true"
            ></v-data-table>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center" text-align="center">
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
      </v-row>
      <v-row
        ><!-- 「VMI Demand Chart -->
        <v-col
          v-for="(datasets, index) in demandChartData"
          :key="index"
          cols="12"
          md="6"
          lg="4"
          class="pa-0 my-2"
        >
          <div v-if="!!datasets">
            <HorizontalBarChart
              chart-name="Product Demand"
              :chart-data="datasets"
              :styles="styles.demandChart"
            />
          </div> </v-col
      ></v-row>
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
  </v-container>
</template>

<script>
import LineChart from '~/components/charts/LineChart'
import PieChart from '~/components/charts/PieChart'
import HorizontalBarChart from '~/components/charts/HorizontalBarChart'

export default {
  components: {
    LineChart,
    PieChart,
    HorizontalBarChart,
  },
  props: {
    vmiId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      vmiIdList: [],
      vmiInfo: {},
      vmiStra: {},
      nashGaLog: null,
      nashOptimal: null,
      vmiDemand: null,
      dialog: false,
      confirmResetVmi: false,
      vmiIdRules: [
        (v) => !!v || 'ID is required',
        (v) => (v && v.length >= 5) || 'Invalid Vmi ID',
      ],
      playerColor: ['#36F1CD', '#F46036', '#019dff', '#F4E04D', '#324376'],
      productColor: [
        { name: 'Trứng 6', color: '#E4572E' },
        { name: 'Trứng 10', color: '#9EEFE5' },
        { name: 'Trứng 12', color: '#FCCA46' },
      ],
      costNameMap: {
        TA: 'Triết khấu',
        TTC: 'Vận chuyển',
        TIC: 'Lưu kho',
        TLC_M: 'Hao hụt',
        TMC: 'Sản xuất và quản lý',
        TMRC: 'Nguyên Liệu Thô',
        TC_M: 'Tổng chi phí',
        TR_M: 'Tổng Doanh thu',
      },
      styles: {
        demandChart: {
          width: '90%',
          maxWidth: '1250px',
          height: '100%',
          maxHeight: '320px',
          margin: 'auto',
        },
      },
      barThickness: 15,
      profitChartData: null,
      fitnessChartData: null,
      profitPieChartData: null,
      demandChartData: null,
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
    this.getVMI()
  },
  mounted() {},
  methods: {
    getVMI() {
      if (!this.vmiIdList.includes(this.vmiId)) {
        this.vmiIdList.push(this.vmiId)
        localStorage.setItem('vmiIds', JSON.stringify(this.vmiIdList))
      }
      this.dialog = true
      const querystring = process.env.GET_VMI_API_URL + '?vmi_id=' + this.vmiId
      this.$axios
        .$get(querystring)
        .then((res) => {
          this.nashGaLog = res.nash_ga_log
          this.nashOptimal = res.nash_strategy
          this.vmiStgData.A = this.nashOptimal.A
          this.vmiStgData.cp = this.nashOptimal.cp
          this.vmiStgData.a = this.nashOptimal.a
          this.vmiCostData = this.nashOptimal.cost
          this.vmiProfit = this.nashOptimal.profit
          this.vmiDemand = this.nashOptimal.product_demand
          this.vmiInfo.retailerCount = Object.keys(res.vmi_val.retailer).length
          this.vmiInfo.playerCount = this.vmiInfo.retailerCount + 1
          this.vmiInfo.nashGaStep = this.nashGaLog.length
          this.dialog = false
        })
        .then((_) => {
          // Get VMI Strategy
          this.getVmiStrategy()

          // Get vmi Cost
          this.getVmiCost()

          // Get「Nash GA」 Profit & Fitness Chart Dataset
          this.calcNashGADatasets()

          // Get Profit Pie Chart Dataset
          this.calcNashGaOptDatasets()

          // Get Product Demand
          this.calcVmiDemand()
        })
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

    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    // VMI Cost
    getVmiCost() {
      this.desserts.vmiCost = []
      for (const costName in this.vmiCostData) {
        const cost = this.numberWithCommas(~~this.vmiCostData[costName])
        const costItem = {
          name: '',
          value: cost,
        }
        if (costName in this.costNameMap) {
          costItem.name = this.costNameMap[costName]
          this.desserts.vmiCost.push(costItem)
        }
      }
      const profitItem = {
        name: 'Lợi nhuận',
        value: this.numberWithCommas(this.vmiProfit[0]),
      }
      this.desserts.vmiCost.push(profitItem)
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

    // Calculate VMI Demands
    calcVmiDemand() {
      this.demandChartData = []
      this.productColor.forEach((product, idx) => {
        const productDatasets = this.getProductDatasets(idx)
        this.demandChartData.push(productDatasets)
      })
    },
    getProductDatasets(productId) {
      const datasets = {
        labels: [],
        datasets: [],
      }
      const labelData = {
        label: this.productColor[productId].name,
        backgroundColor: this.productColor[productId].color,
        barThickness: this.barThickness,
        data: [],
      }
      datasets.datasets.push(labelData)
      for (let playerID = 1; playerID < this.vmiInfo.playerCount; playerID++) {
        const playerName = 'Retailer ' + playerID
        datasets.labels.push(playerName)
        datasets.datasets[0].data.push(this.vmiDemand[playerID - 1][productId])
      }
      return datasets
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
