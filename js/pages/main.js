Vue.component('main-page', {
  data() {
    return {
      data: {
        data: [],
        loading: false,
        status: "Ready to load"
      },

      pagination: {
        rowsPerPage: 0
      },
      columns: [
        'Region', 'Country', 'Item Type', 'Sales Channel', 'Order Priority', 'Order Date', 'Order ID',
        'Ship Date', 'Units Sold', 'Unit Price', 'Unit Cost', 'Total Revenue', 'Total Cost', 'Total Profit']
        .map(column => {
          return {
            name: column,
            label: column,
            field: column
          }
        })
    }
  },
  methods: {
    status: function (msg) {
      console.log(msg)
      this.data.status = msg;
    },
    csvJSON: function (csv) {
      const lines = csv.split('\n')
      const result = []
      const headers = lines[0].split(',')

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i])
          continue
        const obj = {}
        const currentline = lines[i].split(',')

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]
        }
        result.push(obj)
      }
      return result
    },
    loadData: function () {
      this.status('Data loading');
      this.data.loading = true;

      // axios('5m Sales Records.csv', { responseType: 'arraybuffer' })
      // axios('500000 Sales Records.csv')
      axios('500000 Sales Records.csv.gz', { responseType: 'arraybuffer' })
        // axios('1m Sales Records.csv')
        .catch((err) => {
          console.err(err)
        }).then((res) => {
          var data = fflate.decompressSync(new Uint8Array(res.data));
          data = fflate.strFromU8(data);
          this.status('Data loaded');
          this.status('Data decoding');
          var json = Object.freeze(this.csvJSON(data));
          // var json = this.csvJSON(text);
          this.status('Data parsed')
          this.data.data = json;
          this.data.loading = false;
        });
    }
  },
  template: `
      <div class="flex fit column no-wrap items-center content-center">
      <div class="col-1 flex items-center content-center">
        <q-btn label="Load Data" @click="loadData()"/>
      </div>
      <q-table
        class="col-11 full-width no-shadow"
        title="Treats"
        :data="data.data"
        :columns="columns"
        row-key="index"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :loading="data.loading"
        >
      </q-table>
      </div>
    `
});