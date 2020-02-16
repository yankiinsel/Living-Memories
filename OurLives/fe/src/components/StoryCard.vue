<template>
  <div class="stories">
    <ul class="storyList" id="storyList">
      <router-link class="storyCell"
                    tag="li"
                    v-for="story in filteredStories" :key="story.id"
                    :to="{ name: 'StoryDetail', params: { id: story.id }}">
        <h3 class="title">{{ story.title }}</h3>
        <div class="description">
          {{ story.description }}
          <br>
          <br>
          <div v-if="story.username">
            Author: {{ story.username }}
          </div>
          <div v-if="story.taggedPeople">
            People: {{ story.taggedPeople }}
          </div>
          <div v-if="story.date">
            Date: {{ dateToString(story.date)}}
          </div>
          <div v-if="story.location">
            Location: {{story.location}}
          </div>
        </div>
        <div class="thumbnail">
          <img v-if="story.imgUrl" :src="story.imgUrl"/>
        </div>
        <br>
      </router-link>
    </ul>
  </div>
</template>

<script>
import Story from '../models/Story';

export default {

  name: 'StoryCard',

  props: ['filteredStories'],

  methods: {
    dateToString(date) {
      return Story.dateToString(date);
    },
  },
};
</script>

<style scoped>
.stories {
  display: grid;
  justify-content: left;
  align-items: left;
  grid-area: stories;
  grid-template:  " storyList " auto
                  / 1fr;
}

.storyList {
  display: grid;
  grid-area: storyList;
  grid-auto-rows: auto;
  grid-gap: 20px;
  padding-left: 0;
}

ul.storyList li {
  padding: 8px;
  background-color: #ffffff00;
}

.storyCell {
  display: grid;
  background-color: #ffffff !important;
  grid-template:"   .     title             title          .             " auto
                "   .     thumbnail         thumbnail      .             " auto
                "   .     description       description    .             " auto
                "   .     .                 .              .             " 36px
                /   36px  1fr               auto           36px;
  text-align: left;
  box-shadow: 4px 4px #00000017;
}

.description {
  grid-area: description;
  margin-top: 12px;
}

.thumbnail img {
  height: 100%;
  width: auto;
  max-height: 256px;
  object-fit: contain;
}

.thumbnail {
  grid-area: thumbnail;
  overflow: hidden;
 }

.title {
  grid-area: title;
  font-weight: bold;
  margin-top: 12px;
}
</style>
