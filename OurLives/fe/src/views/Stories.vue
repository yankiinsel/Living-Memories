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
    <story-card :filteredMemories="filteredMemories"></story-card>
  </div>
</template>

<script>
import StoryService from '../services/StoryService';
import StoryCard from '../components/StoryCard.vue';

export default {

  name: 'Stories',

  components: {
    StoryCard,
  },

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
  },
};
</script>

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
