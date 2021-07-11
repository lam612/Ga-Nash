<template>
  <v-container fluid>
    <v-row justify="center" text-align="center">
      <v-col cols="12" md="6" lg="4" class="pa-0 my-2">
        <h1 class="font-weight-light mb-5 text-center">VMI Job Manager</h1>
        <JobStatusList />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import JobStatusList from '~/components/JobStatusList'
export default {
  components: {
    JobStatusList,
  },
}
</script>
