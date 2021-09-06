<template>
  <div class="container flex flex-wrap p-3 items-center justify-center items-stretch mx-auto sm:p-10">
    <Day :date="this.today" />
    <Day :date="this.tomorrow" />
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
      tomorrow: new Date()
    };
  },
  created() {
    this.tomorrow.setDate(this.today.getDate() + 1)
  }
})
</script>
