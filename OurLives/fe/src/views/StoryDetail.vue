<template>
  <div class="story-detail">
    <h3 class="title">{{ story.title }}</h3>
    <div class="description">
      <p class="story-description">
        {{ story.description }}
      </p>
      <p v-if="story.username" class="story-username">
        {{ 'Author: ' + story.username }}
      </p>
      <p v-if="story.location" class="story-location">
        {{ 'Location: ' + story.location }}
      </p>
      <story-map :coordinates="coordinates"
                 :mapName="mapName">
      </story-map>
      <p v-if="story.taggedPeople" class="story-people">
        {{ 'People: ' + story.taggedPeople }}
      </p>
      <p v-if="story.date" class="story-time">
        {{ 'Date: ' + dateToString(story.date) }}
      </p>
    </div>
    <div class="thumbnail">
      <img  v-if="story.imgUrl"
            :src="story.imgUrl"/>
    </div>
    <br>
  </div>
</template>

<script>
import StoryService from './../services/StoryService';
import Story from './../models/Story';
import StoryMap from './../components/StoryMap.vue';

const $ = require('jquery');

window.$ = $;
require('jquery-confirm');

export default {

  name: 'StoryDetail',

  props: ['name'],

  components: { StoryMap },

  data() {
    return {
      story: {},
      id: '',
      isPhotoLoaded: false,
      clickedText: '',
      mapName: `${this.name}-map`,
    };
  },

  async created() {
    this.id = this.$attrs.id;
    await this.getStory();
  },

  computed: {
    coordinates() {
      return this.story.coords;
    },
  },

  methods: {

    async getStory() {
      await StoryService.getStory(this.id, (res) => {
        // eslint-disable-next-line prefer-destructuring
        this.story = res.data[0];
      });
    },

    dateToString(date) {
      return Story.dateToString(date);
    },
  },
};
</script>

<style scoped>
.story-detail {
  display: grid;
  text-align: left;
  width: 100%;
  height: 100%;

}

@media (min-width: 700px) {
  .story-detail {
    grid-template: ".   title        ." auto
                   ".   thumbnail    ." auto
                   ".   description  ." auto
                   /13%   1fr        13%;
  }
}

@media (max-width: 700px) {
  .story-detail {
    grid-template: ".   title        ." auto
                   ".   thumbnail    ." auto
                   ".   description  ." auto
                   /2%   1fr         2%;
  }
}

.description {
  grid-area: description;
  display: grid;
  grid-template: "story-description" auto
                 "story-username"  auto
                 "story-people"  auto
                 "story-location"  auto
                 "map"  256px
                 "story-time"  auto
                / 1fr;

}

.thumbnail {
  grid-area: thumbnail;
  overflow: hidden;
  object-fit: cover;
  margin: 8px;
 }

 .thumbnail img {
  max-width: 100%;
  width: auto;
  object-fit: contain;
}

.title {
  grid-area: title;
  font-weight: bold;
  margin: 8px;
}

.description {
  grid-area: description;
  margin-top: 8px;
}

.deleteButton {
  grid-area: deleteButton;
}

.story-people {
  margin: 8px;
  grid-area: story-people;
}

.story-description {
  margin: 8px;
  grid-area: story-description;
}

.story-time {
  margin: 8px;
  grid-area: story-time;
}

.story-location {
  margin: 8px;
  grid-area: story-location;
}

.story-username {
  margin: 8px;
  grid-area: story-username;
}
</style>
