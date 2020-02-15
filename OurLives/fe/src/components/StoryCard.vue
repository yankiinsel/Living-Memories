<template>
  <div class="memories">
    <ul class="memoryList" id="memoryList">
      <router-link class="memoryCell"
                    tag="li"
                    v-for="memory in filteredMemories" :key="memory.id"
                    :to="{ name: 'StoryDetail', params: { id: memory.id }}">
        <p class="title">{{ memory.title }}</p>
        <div class="description">
          {{ memory.description }}
          <br>
          <br>
          <div v-if="memory.username">
            Author: {{ memory.username }}
          </div>
          <div v-if="memory.taggedPeople">
            People: {{ memory.taggedPeople }}
          </div>
          <div v-if="memory.date">
            Date: {{ dateToString(memory.date)}}
          </div>
          <div v-if="memory.location">
            Location: {{memory.location}}
          </div>
        </div>
        <div class="thumbnail">
          <img v-if="memory.imgUrl" :src="memory.imgUrl"/>
          <img v-else src= "http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png"/>
        </div>
        <br>
      </router-link>
    </ul>
  </div>
</template>

<script>
import Memory from '../models/Memory';

export default {

  name: 'StoryCard',

  props: ['filteredMemories'],

  methods: {
    dateToString(date) {
      return Memory.dateToString(date);
    },
  },
};
</script>

<style scoped>
.memories {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-area: memories;
  grid-template:  " memoryList " auto
                  / 1fr;
}

.memoryList {
  display: grid;
  grid-area: memoryList;
  grid-auto-rows: auto;
  grid-gap: 20px;
  padding-left: 0;
}

ul.memoryList li {
  padding: 8px;
  background-color: #ffffff00;
}

ul.memoryList li p { margin: 24px; display: block; width: 100%; height: 100%; }

.memoryCell {
  display: grid;
  background-color: #ffffffbb !important;
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
  margin-top: 24px;
}

.thumbnail img {
  width: 20vw;
  height: auto;
  margin: 24px;
}

.thumbnail {
  grid-area: thumbnail;
  overflow: hidden;
  object-fit: cover;
 }

.title {
  grid-area: title;
  font-weight: bold;
}
</style>
