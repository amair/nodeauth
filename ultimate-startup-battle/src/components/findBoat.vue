<template>
    <div>
      <input type="text" name="" v-model="boatName">
      <button
          class="btn btn-info log"
          @click="findBoat()">
      Find Boat
      </button>
      <p> {{boatName}}</p>
    </div>
</template>

<script>

export default {
  name: 'find-boat',
  data() {
    return {
      boatName: '',
    };
  },
  methods: {
    findBoat() {

    },
  },
};
</script>