<template>
    <div class="selectDate">
      <b-form-select class="selectDecade" v-model="decadesInt" v-on:change="update">
        <option v-for="decade in decades"
                :value="decade.value"
                :key="decade.value">
                  {{ decade.key }}
        </option>
      </b-form-select>
      <b-form-select class="selectYear"
                     :disabled="!decadesInt"
                     v-model="yearsInt"
                     v-on:change="update">
        <option v-for="year in years"
                :value="year.value"
                :key="year.value">
                  {{ year.key }}
        </option>
      </b-form-select>
      <b-form-select class="selectMonth" :disabled="!yearsInt" v-model="monthString"
       v-on:change="update">
        <option v-for="month in months"
                :value="month.value"
                v-bind:key="month.value">
                  {{ month.key }}
        </option>
      </b-form-select>
      <b-form-select class="selectDay" :disabled="!monthString || !yearsInt " v-model="dayInt"
       v-on:change="update">
        <option v-for="day in days"
                :value="day.value"
                v-bind:key="day.value">
                {{ day.key }}
        </option>
      </b-form-select>
      <div class="selectTime">
        <date-picker  :disabled="!monthString || !yearsInt || !dayInt"
                      v-model="timeString"
                      v-on:dp-change="update"
                      :config="options">
        </date-picker>
      </div>
    </div>
</template>

<script>
import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

Vue.use(datePicker);

export default {
  /* eslint-disable no-debugger */

  name: 'SelectDate',
  // Variables here

  data() {
    return {
      decadesInt: null,
      yearsInt: null,
      monthString: null,
      dayInt: null,
      timeString: null,
      date: new Date(),
      options: {
        format: 'HH:mm',
        useCurrent: false,
        // viewMode: 'moment',
        // keepOpen: true,
        // inline: true
      },

      decades: [
        { key: 'Decade', value: null },
        { key: '1900s', value: 1900 },
        { key: '1910s', value: 1910 },
        { key: '1920s', value: 1920 },
        { key: '1930s', value: 1930 },
        { key: '1940s', value: 1940 },
        { key: '1950s', value: 1950 },
        { key: '1960s', value: 1960 },
        { key: '1970s', value: 1970 },
        { key: '1980s', value: 1980 },
        { key: '1990s', value: 1990 },
        { key: '2000s', value: 2000 },
        { key: '2010s', value: 2010 },
        { key: '2020s', value: 2020 },
      ],

      months: [
        { key: 'Month', value: null },
        { key: 'January', value: 'Jan' },
        { key: 'February', value: 'Feb' },
        { key: 'March', value: 'Mar' },
        { key: 'April', value: 'Apr' },
        { key: 'May', value: 'May' },
        { key: 'June', value: 'Jun' },
        { key: 'July', value: 'Jul' },
        { key: 'August', value: 'Aug' },
        { key: 'September', value: 'Sep' },
        { key: 'October', value: 'Oct' },
        { key: 'November', value: 'Nov' },
        { key: 'December', value: 'Dec' },
      ],

      days: [
        { key: 'Day', value: null },
        { key: '1', value: 1 },
        { key: '2', value: 2 },
        { key: '3', value: 3 },
        { key: '4', value: 4 },
        { key: '5', value: 5 },
        { key: '6', value: 6 },
        { key: '7', value: 7 },
        { key: '8', value: 8 },
        { key: '9', value: 9 },
        { key: '10', value: 10 },
        { key: '11', value: 11 },
        { key: '12', value: 12 },
        { key: '13', value: 13 },
        { key: '14', value: 14 },
        { key: '15', value: 15 },
        { key: '16', value: 16 },
        { key: '17', value: 17 },
        { key: '18', value: 18 },
        { key: '19', value: 19 },
        { key: '20', value: 20 },
        { key: '21', value: 21 },
        { key: '22', value: 22 },
        { key: '23', value: 23 },
        { key: '24', value: 24 },
        { key: '25', value: 25 },
        { key: '26', value: 26 },
        { key: '27', value: 27 },
        { key: '28', value: 28 },
        { key: '29', value: 29 },
        { key: '30', value: 30 },
        { key: '31', value: 31 },
      ],

      components: {
        datePicker,
      },
    };
  },

  computed: {

    years() {
      return [
        { key: 'Year', value: null },
        { key: this.decadesInt, value: this.decadesInt },
        { key: this.decadesInt + 1, value: this.decadesInt + 1 },
        { key: this.decadesInt + 2, value: this.decadesInt + 2 },
        { key: this.decadesInt + 3, value: this.decadesInt + 3 },
        { key: this.decadesInt + 4, value: this.decadesInt + 4 },
        { key: this.decadesInt + 5, value: this.decadesInt + 5 },
        { key: this.decadesInt + 6, value: this.decadesInt + 6 },
        { key: this.decadesInt + 7, value: this.decadesInt + 7 },
        { key: this.decadesInt + 8, value: this.decadesInt + 8 },
        { key: this.decadesInt + 9, value: this.decadesInt + 9 },
      ];
    },

    memoryDate() {
      return {
        decade: this.decadesInt,
        year: this.yearsInt,
        month: this.monthString,
        day: this.dayInt,
        time: this.timeString,
      };
    },
  },

  methods: {
    update() {
      this.$emit('update', this.memoryDate);
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.selectDecade {
  grid-area: selectDecade;
  margin: 15px;
}

.selectYear {
  grid-area: selectYear;
  margin: 15px;
}

.selectMonth {
  grid-area: selectMonth;
  margin: 15px;
}

.selectDay {
  grid-area: selectDay;
  margin: 15px;
}
.selectTime {
  grid-area: selectTime;
  margin: 15px;
  position: relative;
}

.selectExactDate {
  grid-area: selectExactDate;
  margin-top: 15px;
  margin-left: 15px;
}

.selectDate {
  grid-area: selectDate;
  display: grid;
  grid-template: " selectDecade selectYear selectMonth selectDay selectTime" auto
                  /1fr          1fr        1fr         1fr       1fr;
}

</style>

