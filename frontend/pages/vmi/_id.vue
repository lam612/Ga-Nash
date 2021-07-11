<template>
  <v-container fluid> <ModelReport :vmi-id="vmiId" /></v-container>
</template>

<script>
import ModelReport from '~/components/ModelReport'

export default {
  components: {
    ModelReport,
  },
  data() {
    return {
      vmiId: '',
    }
  },
  created() {
    this.vmiId = this.$route.params.id
  },
}
</script>
