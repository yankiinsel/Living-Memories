<template>
  <div id="Memory">
    <div class="memoryCell">
        <h3 class="title">{{ memory.title }}</h3>
        <!-- <p v-html="memory.description"> -->
        <div class="description">
          <p class="memory-description">
            {{ memory.description }}
          </p>
          <p v-if="memory.username" class="memory-username">
            {{ 'Author: ' + memory.username }}
          </p>
          <p v-if="memory.location" class="memory-location">
            {{ 'Location: ' + memory.location }}
          </p>
          <memory-map :coordinates="coordinates"
                      :mapName="mapName">
          </memory-map>
          <p v-if="memory.taggedPeople" class="memory-people">
            {{ 'People: ' + memory.taggedPeople }}
          </p>
          <p v-if="memory.date" class="memory-time">
            {{ 'Date: ' + dateToString(memory.date) }}
          </p>
        </div>
        <!-- </p> -->
        <div class="thumbnail">
          <img  v-if="memory.imgUrl"
                :src="memory.imgUrl"/>
        </div>
        <br>
    </div>
  </div>
</template>

<script>
import StoryService from './../services/StoryService';
import Memory from './../models/Memory';
import MemoryMap from './../components/MemoryMap.vue';

const $ = require('jquery');

window.$ = $;
require('jquery-confirm');

export default {

  name: 'StoryDetail',

  props: ['name'],

  components: { MemoryMap },

  data() {
    return {
      memory: {},
      id: '',
      isPhotoLoaded: false,
      clickedText: '',
      mapName: `${this.name}-map`,
    };
  },

  async created() {
    this.id = this.$attrs.id;
    await this.getMemory();
  },

  computed: {
    coordinates() {
      return this.memory.coords;
    },
  },

  methods: {

    async getMemory() {
      await StoryService.getMemory(this.id, (res) => {
        this.memory = res.data[0];
      });
    },

    dateToString(date) {
      return Memory.dateToString(date);
    },
  },
};
</script>

<style scoped>
#Memory {
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-template:  " .     .           .  "  5%
                  " .     memoryCell  .  "  auto
                  / 5%    1fr         5%;
}

.memoryCell {
  grid-area: memoryCell;
  display: grid;
  grid-template: "   title         title          title         " auto
                 "   thumbnail     thumbnail      thumbnail     " auto
                 "   description   description    description   " auto
                 /    1fr          auto           auto;
  text-align: left;
}

.description {
  grid-area: description;
  display: grid;
  grid-template: "memory-description" auto
                 "memory-username"  auto
                 "memory-people"  auto
                 "memory-location"  auto
                 "map"  256px
                 "memory-time"  auto
                / auto;

}

.thumbnail {
  grid-area: thumbnail;
  overflow: hidden;
  object-fit: cover;
  margin: 16px;
 }

.title {
  grid-area: title;
  font-weight: bold;
  margin: 15px;
}

.description {
  grid-area: description;
  margin-top: 10px;
}

.deleteButton {
  grid-area: deleteButton;
}

.memory-people {
  margin: 15px;
  grid-area: memory-people;
}

.memory-description {
  margin: 15px;
  grid-area: memory-description;
}

.memory-time {
  margin: 15px;
  grid-area: memory-time;
}
.memory-location {
  margin: 15px;
  grid-area: memory-location;
}
.memory-username {
  margin: 15px;
  grid-area: memory-username;
}
</style>
