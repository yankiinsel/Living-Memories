<template>
  <div id="Stories">
    <div class="searchGroup">
      <b-input-group size="md" class="mb-3">
        <b-form-input class="searchBar"
                      v-model="searchedKeyword"
                      type="text"
                      placeholder="Search for stories">
        </b-form-input>
        <b-btn size="md" variant="success" v-on:click="filterSearch(searchedKeyword)">Go!</b-btn>
      </b-input-group>
    </div>
    <story-card :filteredStories="filteredStories"></story-card>
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
      stories: [],
      searchedKeyword: '',
    };
  },

  created() {
    this.prepareStories();
  },

  computed: {
    filteredStories() {
      return this.stories.filter(story =>
        JSON.stringify(story).toLowerCase().includes(this.searchedKeyword.toLowerCase()));
    },
  },

  methods: {

    async prepareStories() {
      this.stories = [];
      // Get the stories to be shown from the API
      await StoryService.getAllStories((res) => {
        res.data.forEach((story) => {
          this.stories.push({
            title: story.title,
            description: story.description,
            location: story.location,
            coords: story.coords,
            taggedPeople: story.taggedPeople,
            username: story.username,
            isPublic: story.isPublic,
            date: story.date,
            imgUrl: story.imgUrl,
            // eslint-disable-next-line
            id: story._id,
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
  background-image: linear-gradient(to top,#ced7f088 , #ced7f088);
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

@media (max-width: 700px) {
  #Stories {
    grid-template:  ". searchGroup ."  auto
                    ". stories    ."  auto
                    / 2% 1fr 2%;
  }
}

@media (min-width: 700px) {
  #Stories {
    grid-template:  ". searchGroup ."  auto
                    ". stories    ."  auto
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
