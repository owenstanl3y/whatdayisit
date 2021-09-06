<template>
  <div class="flex flex-col justify-center bg-red-300 w-full m-4 p-2.5 text-center rounded-md md:w-96 lg:w-80 xl:w-64 text-coolGray-100 shadow-md transform duration-500 hover:-translate-y-1">
    <h1 class="text-lg "> {{ getTop() }}</h1>
    <h2 >
      {{ body }}
    </h2>
    <h3 class="border-gray-500" v-if="dayType.extra"> {{ dayType.comment }} </h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DayType {
  has_school: boolean
  type: string,
  normal: boolean,
  extra: boolean
  comment: string
}

export default Vue.extend({
  name: "Day",
  props: {
    date: Date
  },
  data() {
    return {
      body: {},
      dayType: {} as DayType,
      hasFetched: false
    }
  },
  methods: {
    getTop(): String {
      const rD = this.$props.date;
      const lD = new Date();
      if (lD.getDate()==rD.getDate()){
        return "Today";
      } else if (lD.getDate()+1==rD.getDate()){
        return "Tomorrow"
      }
      return ""
    },
    getBody(hs: boolean): String {
      const rD = this.$props.date;
      let s = rD.toLocaleDateString( "locale", { weekday: 'long' }) + " the " + this.dateOrdinal(rD.getDate()) + " of " + rD.toLocaleDateString( "locale", { month: 'long' });
      if (rD.getDay() === 6 || rD.getDay() === 0) {
        s += " is a weekend enjoy!"
      } else if (!hs) {
        s += " there's no school!"
      } else if (this.hasFetched) {
        s += ` is a ${this.dayType.type} day`;
      }
      return s;
    },
    dateOrdinal(d: number) {
      return d+(31==d||21==d||1==d?"st":22==d||2==d?"nd":23==d||3==d?"rd":"th")
    },

    async fetchData() {
      this.dayType = await fetch(`/api/v1/dates/${this.$props.date.toISOString().substring(0, 10)}`).then(response => response.json()) as DayType;
      this.hasFetched = true;
      this.body = this.getBody(this.dayType.has_school);

    }
  },
  created() {
    this.body = this.getBody(true)
  },
  beforeMount() {
    this.fetchData();
  }
})
</script>

<style scoped>

</style>
