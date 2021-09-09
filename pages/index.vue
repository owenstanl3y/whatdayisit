<template>
  <div class="flex flex-col justify-center text-center">
    <div class="container flex flex-wrap p-3 items-center justify-center items-stretch mx-auto sm:p-10">
      <Day :date="this.today" />
      <Day :date="this.tomorrow" />
    </div>
    <a class="shadow-md rounded-md bg-red-300 p-2 mx-auto" href="/Schedule.pdf">Schedule</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Day from "~/components/Day.vue";

export default Vue.extend({
  components: {Day},
  data() {
    return {
      today: new Date(),
      tomorrow: new Date(),
    };
  },
  created() {
    this.tomorrow.setDate(this.today.getDate() + 1)
  }
})
</script>
