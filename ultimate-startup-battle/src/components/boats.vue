<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">Boats</h3>
    <hr/>

    <find-boat></find-boat>

    <div class="col-sm-4" v-for="boat in boats" :key="boat[ 'Cert No' ]">
      <display-boat :boat = boat >
      </display-boat>
    </div>

    <div class="col-sm-12">
      <div class="jumbotron text-center">
        <h2>View Boats</h2>
        <router-link class="btn btn-lg btn-success" to="/">
          All boats
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import appNav from './appNav';
import findBoat from './findBoat';
import { isLoggedIn } from '../utils/auth';
import { getBoats } from '../utils/battles-api';
import displayBoat from './displayBoat';

export default {
  name: 'boats',
  components: {
    appNav,
    findBoat,
    displayBoat,
  },
  data() {
    return {
      boats: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getBoats() {
      getBoats().then((boats) => {
        this.boats = boats;
      });
    },
  },
  mounted() {
    this.getBoats();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>