<template>
  <div>
    <display-boat :boat = this.boat >
    </display-boat>
  </div>
</template>

<script>
import { getBoat } from '../utils/battles-api';
import displayBoat from './displayBoat';

export default {
  name: 'boat',
  components: {
    displayBoat,
  },
  props: ['id'],

  data() {
    return {
      boat: {},
    };
  },
  methods: {
    getBoat(id) {
      getBoat(id).then((boat) => {
        this.boat = boat;
      });
    },
  },
  mounted() {
    this.getBoat(this.id);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>