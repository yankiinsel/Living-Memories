<template>
  <div id="Post">
    <div class="postStory">
      <div class="inputText">
        <b-form-input class="editTitle"
                      type="text"
                      v-model="title"
                      placeholder="Tell us what"/>
        <b-form-input class="editTaggedPeople"
                      type="text"
                      v-model="taggedPeople"
                      placeholder="Tell us who"/>
        <add-photo v-on:update="updateImageUrl"></add-photo>
        <story-map :coordinates="coordinates"
                    :editEnabled="true"
                    @update="updateStoryLocation"
                    :mapName="mapName">
        </story-map>
        <select-date v-on:update="updateStoryDate">
        </select-date>
        <b-form-textarea class="editDescription"
                      type="text"
                      v-model="message"
                      placeholder="Enter your story..."/>
      </div>
      <b-button class="postButton"
                variant="success"
                v-on:click="postStory"
                :disabled="isLoading">{{postButtonName}}
      </b-button>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import StoryService from '../services/StoryService';
import MapService from '../services/MapService';
import Story from '../models/Story';
import SelectDate from '../components/SelectDate.vue';
import StoryMap from '../components/StoryMap.vue';
import AddPhoto from '../components/AddPhoto.vue';

export default {

  name: 'NewPost',

  props: ['name'],
  components: {
    SelectDate,
    StoryMap,
    AddPhoto,
  },

  data() {
    return {
      locs: [],
      searchedKeyword: '',
      uploadedImage:
        'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
      message: '',
      title: '',
      isPublic: '',
      username: '',
      storyDate: '',
      location: '',
      imgUrl: '',
      taggedPeople: '',
      mapName: `${this.name}-map`,
      annotatedText: '',
      coordinates: [],
      isLoading: false,
    };
  },

  computed: {
    story() {
      return {
        description: this.message,
        title: this.title,
        imgUrl: this.imgUrl,
        location: this.locs.toString(),
        coords: this.coordinates,
        taggedPeople: this.taggedPeople,
        username: this.username,
        date: this.storyDate,
        isPublic: true,
      };
    },

    postButtonName() {
      if (this.isLoading) {
        return 'Posting..';
      }
      return 'POST';
    },
  },

  // On Create here
  async created() {
    if (JSON.parse(sessionStorage.getItem('vue-session-key'))) {
      this.username = JSON.parse(sessionStorage.getItem('vue-session-key')).session_username;
    } else {
      this.username = 'anonymous';
    }
  },

  // Methods here
  methods: {
    getStoryDate(date) {
      Story.dateToString(date);
    },

    updateStoryDate(value) {
      this.storyDate = value;
    },

    updateStoryLocation(value) {
      this.coordinates = value;
    },

    updateImageUrl(value) {
      this.imgUrl = value;
      // eslint-disable-next-line no-debugger
      debugger;
    },

    async postStory() {
      this.isLoading = true;
      const promise1 = new Promise((resolve) => {
        if (this.coordinates) {
          this.coordinates.forEach(async (coordinate) => {
            try {
              const location = MapService.getLocation(coordinate.lat, coordinate.lng);
              this.locs.push(location);
            } catch (e) {
              this.isLoading = false;
            }
          });

          setTimeout(resolve, 2000, this.locs);
        }
      });
      // eslint-disable-next-line no-debugger
      debugger;
      Promise.all([promise1]).then((values) => {
        this.locs = values[0].filter(value => value.data).map(value => value.data);
        StoryService.post(this.story, () => {
          this.isLoading = false;
          this.$router.push({ name: 'Stories' });
        }).catch(() => {
          this.isLoading = false;
        });
      });
    },
  },
};
</script>

<style scoped>
#Post {
  display: grid;
  background-image: linear-gradient(to top, #f7e3d888, #ced7f088);
}

@media (min-width: 700px) {
  #Post {
    grid-template:
      ".     postStory  ." auto
      / 13%  1fr        13%;
  }
}

@media (max-width: 700px) {
  #Post {
    grid-template:
      ".    postStory  ." auto
      /5%   1fr        5%;
  }
}


.title {
  margin-top: 8px;
  margin-bottom: 8px;
  grid-area: title;
  font-weight: bold;
}

.description {
  grid-area: description;
}

.view-annotations {
  grid-area: view-annotations;
}

.inputText {
  grid-area: inputText;
  margin:15px;
  display: grid;
  grid-template:  " editTitle        " auto
                  " editImage        " auto
                  " editTaggedPeople " auto
                  " selectDate       " auto
                  " map              " 256px
                  " editDescription  " auto
                  / 1fr             ;
}

.postStory {
  grid-area: postStory;
  display: grid;
  grid-template:
    " inputText  inputText     " auto
    " .          postButton    " auto
    / auto       128px;
}

.postButton {
  margin: 8px;
  grid-area: postButton;
}

.editTitle {
  margin-top: 8px;
  margin-bottom: 8px;
  grid-area: editTitle;
}

.editTaggedPeople {
  margin-top: 8px;
  margin-bottom: 8px;
  grid-area: editTaggedPeople;
}

.editDescription {
  margin-top: 8px;
  margin-bottom: 8px;
  grid-area: editDescription;
}

</style>

