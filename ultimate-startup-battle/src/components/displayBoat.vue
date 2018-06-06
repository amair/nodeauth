<!--   "Boat Name": "POTEEN",
  "Sail No": "GBR8318N",
  "Cert No": "45",
  "Issue Date": "26/03/2018",
  "Cert Year": "2018",
  "TCC": "0.823",
  "Endorsed": "E",
  "Dayboat": "",
  "Short Handed": "",
  "Non Spi TCC": "0.815",
  "Crew": "5",
  "DLR": "265",
  "LH": "6.55",
  "Beam": "2.59",
  "Draft": "1.35",
  "Headsails": "Multiple",
  "Series Date": "1976",
  "Age Date": "1990",
  "Racing Area": "104",
  "SSS Base Value": "15",
  "STIX": "0",
  "AVS": "0",
  "Category": "0",
  "ValidCode": "Yes" -->
<template>
  <div class="panel panel-danger">
    <div class="panel-heading" v-on:click="boatDetails(boat)">
      <h3 class="panel-title"> {{ getBoatName() }} </h3>
    </div>
    <div class="panel-body">
      <p>
          <span class="badge alert-info"> Sail Number: </span>
          <strong> {{ getSailNumber() }} </strong>
      </p>
      <p>
          <span class="badge alert-info"> Certificate Year: </span>
          {{ getCertYear() }}
      </p>
      <p>
          <span class="badge alert-info"> Certificate Issued: </span>
          {{ getIssueDate() }}
      </p>
      <p>
          <span class="badge alert-info"> Crew allowance: </span>
          {{ boat.Crew }}
      </p>
      <p>
          <span class="badge alert-info"> Length (m): </span>
          {{ boat.DLR }}
      </p>
      <p>
          <span class="badge alert-info"> Beam (m): </span>
          {{ boat.Beam }}
      </p>
      <p>
          <span class="badge alert-info"> Draft (m): </span>
          {{ boat.Draft }}
      </p>
      <p>
          <span class="badge alert-danger"> Correction factor: </span>
          <strong>{{ boat.TCC }}</strong>
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'displayBoats',
  props: {
    boat: {
      type: Object,
    },
  },
  data() {
    return {
      boat_name: '',
    };
    // ToDo: Tidy up the boat object to remove spaces and avoid these
    // extra vars
  },
  methods: {
    getBoatName() {
      return (this.boat['Boat Name']);
    },
    getSailNumber() {
      return (this.boat['Sail No']);
    },
    getCertYear() {
      return (this.boat['Cert Year']);
    },
    getIssueDate() {
      return (this.boat['Issue Date']);
    },
    boatDetails(selectedBoat) {
      const id = selectedBoat['Cert No'];
      this.$router.push({ name: 'Boat', params: { id } });
    },
  },
  mounted() {
    this.$nextTick(() => {
      // Code that will run only after the
      // entire view has been rendered
      this.boat_name = this.boat['Boat Name'];
    });
  },
};
</script>