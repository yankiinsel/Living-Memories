<template>
  <div id="Stories">
    <div class="searchGroup">
      <b-input-group size="md" class="mb-3">
        <b-form-input class="searchBar"
                      v-model="searchedKeyword"
                      type="text"
                      placeholder="Search for memories">
        </b-form-input>
        <b-btn size="md" variant="success" v-on:click="filterSearch(searchedKeyword)">Go!</b-btn>
      </b-input-group>
    </div>
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
  </div>
</template>

<script>
import StoryService from '../services/StoryService';
import Memory from '../models/Memory';

export default {
  name: 'Stories',

  data() {
    return {
      memories: [],
      searchedKeyword: '',
    };
  },

  created() {
    this.prepareMemories();
  },

  computed: {
    filteredMemories() {
      return this.memories.filter(memory =>
        JSON.stringify(memory).toLowerCase().includes(this.searchedKeyword.toLowerCase()));
    },

  },

  methods: {
    async prepareMemories() {
      this.memories = [];

      // Get the memories to be shown from the API
      await StoryService.getAllMemories((res) => {
        res.data.forEach((memory) => {
          this.memories.push({
            title: memory.title,
            description: memory.description,
            location: memory.location,
            coords: memory.coords,
            taggedPeople: memory.taggedPeople,
            username: memory.username,
            isPublic: memory.isPublic,
            date: memory.date,
            imgUrl: memory.imgUrl,
            // eslint-disable-next-line
            id: memory._id,
          });
        });
      });
    },

    dateToString(date) {
      return Memory.dateToString(date);
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#Stories {
  display: grid;
  background-image: linear-gradient(to top,#f7e3d888 , #ced7f088);
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

@media (max-width: 700px) {
  #Stories {
    grid-template:  ". searchGroup ."  auto
                    ". memories    ."  auto
                    / 2% 1fr 2%;
  }
}

@media (min-width: 700px) {
  #Stories {
    grid-template:  ". searchGroup ."  auto
                    ". memories    ."  auto
                    / 13% 1fr 13%;
  }
}

.b-form-input {
  font-size: 9px !important;
}

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

.description {
  grid-area: description;
  margin-top: 24px;
}
.username {
  grid-row-start: username;
  margin-top: 24px;

}
.location {
  grid-area: location;
  margin-top: 24px;
}
.searchGroup {
  grid-area: searchGroup;
  margin-top: 24px;
}

.searchBar {
  margin-right: 8px;
}

</style>
