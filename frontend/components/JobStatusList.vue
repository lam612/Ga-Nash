<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ noti }}
      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      :loading="loading"
      :sort-by="['status']"
      :sort-desc="[true]"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>VMI</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-icon
            color="blue"
            v-bind="attrs"
            x-large
            v-on="on"
            @click="updateJobStatus"
          >
            mdi-cloud-sync-outline
          </v-icon>
        </v-toolbar>
      </template>
      <template #[`item.idx`]="{ item }">
        <v-btn plain :href="'/vmi/' + item.idx">{{ item.idx }}</v-btn>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon dense color="light-blue" class="mr-2" @click="editItem(item)">
          mdi-eye-outline
        </v-icon>
        <v-icon dense color="light-red" class="mr-2" @click="resetVMI(item)">
          mdi-refresh
        </v-icon>
      </template>
      <template #no-data>
        <v-btn color="primary" @click="updateJobStatus"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      confirmResetVmi: false,
      snackbar: false,
      noti: '',
      timeout: 2000,
      editedIndex: -1,
      editedItem: {
        idx: '',
      },
      defaultItem: {
        idx: '',
      },
      headers: [
        {
          text: 'ID',
          align: 'center',
          value: 'idx',
          sortable: false,
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Action',
          align: 'center',
          value: 'actions',
          sortable: false,
        },
      ],
      desserts: [],
      loading: true,
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New VMI' : 'Edit VMI'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  created() {
    this.updateJobStatus()
  },
  methods: {
    updateJobStatus() {
      this.loading = true
      const querystring = process.env.GET_JOB_STATUS
      this.$axios.$get(querystring).then((res) => {
        this.desserts = res
        this.loading = false
      })
    },
    editItem(item) {
      // this.editedIndex = this.desserts.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      // this.dialog = true
      this.$router.push('/vmi/' + item.idx)
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
    resetVMI(item) {
      const querystring = process.env.RESET_VMI_API_URL + '?vmi_id=' + item.idx
      this.$axios.$get(querystring).then((res) => {
        console.log(res)
      })
      this.snackbar = true
      this.noti = 'Reset VMI ID : ' + item.idx
    },
  },
}
</script>

<style></style>
