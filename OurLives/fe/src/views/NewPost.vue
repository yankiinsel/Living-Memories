<template>
  <div id="Post">
    <div class="postMemory">
      <div class="inputText">
        <div class="thumbnail">
          <img v-if="imgUrl" :src="imgUrl" style="width:230px; height:auto">
          <img
            v-else
            src="http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png"
            style="width:230px; height:auto">
        </div>
        <b-form-input class="editTitle"
                      type="text"
                      v-model="title"
                      placeholder="Tell us what"/>
        <b-form-input class="editTaggedPeople"
                      type="text"
                      v-model="taggedPeople"
                      placeholder="Tell us who"/>
        <b-form-input class="editImage"
                      type="text"
                      v-model="imgUrl"
                      placeholder="Image URL"/>
        <memory-map :coordinates="coordinates"
                    :editEnabled="true"
                    @update="updateMemoryLocation"
                    :mapName="mapName">
        </memory-map>
        <select-date v-on:update="updateMemoryDate">
        </select-date>
        <b-form-textarea class="editDescription"
                      type="text"
                      v-model="message"
                      placeholder="Enter your story..."/>
      </div>
      <b-button class="postButton"
                variant="success"
                v-on:click="postMemory"
                :disabled="isLoading">{{postButtonName}}
      </b-button>
    </div>
  </div>

</template>
<script>
import 'bootstrap/dist/css/bootstrap.css';
import StoryService from '../services/StoryService';
import MapService from '../services/MapService';
import Memory from '../models/Memory';
import SelectDate from '../components/SelectDate.vue';
import MemoryMap from '../components/MemoryMap.vue';


export default {

  name: 'NewPost',
  // Variables here
  props: ['name'],

  components: {
    SelectDate,
    MemoryMap,
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
      memoryDate: '',
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

    memory() {
      return {
        description: this.message,
        title: this.title,
        imgUrl: this.imgUrl,
        location: this.locs.toString(),
        coords: this.coordinates,
        taggedPeople: this.taggedPeople,
        username: this.username,
        date: this.memoryDate,
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

    getMemoryDate(date) {
      Memory.dateToString(date);
    },

    updateMemoryDate(value) {
      this.memoryDate = value;
    },

    updateMemoryLocation(value) {
      this.coordinates = value;
    },

    async postMemory() {
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
        StoryService.post(this.memory, () => {
          this.isLoading = false;
        }).catch(() => {
          this.isLoading = false;
        });
      });
    },

    async deleteMemory(id) {
      StoryService.delete(id, () => {
        this.getAllMemories();
      })
        .catch((() => {
        }));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Post {
  display: grid;
  background-image: linear-gradient(to top, #f7e3d888, #ced7f088);
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

@media (min-width: 700px) {
  #Post {
    grid-template:
      ".     postMemory ." auto
      ".     memories   ." auto
      / 13%  1fr        13%;
  }
}

@media (max-width: 700px) {
  #Post {
    grid-template:
      ".    postMemory ." auto
      ".    memories   ." auto
      /2%   1fr        5%;
  }
}


.memories {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-area: memories;
  grid-template:
    " memoryList " auto
    / 1fr;
}

.memoryList {
  display: grid;
  grid-area: memoryList;
  grid-auto-rows: auto;
  grid-gap: 20px;
}

ul.memoryList li {
  padding: 8px;
}

ul.memoryList li p {
  margin: 15px;
  display: block;
}

.thumbnail img {
  width: 20vw;
  height: auto;
  padding: 16px;
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
  margin-top: 10px;
}

.view-annotations {
  grid-area: view-annotations;
  bottom: 10px;
}

.inputText {
  grid-area: inputText;
  margin-top: 12px;
  display: grid;
  grid-template:  " editTitle         editTitle        " auto
                  " thumbnail         editImage        " auto
                  " editTaggedPeople  editTaggedPeople " auto
                  " selectDate        selectDate       " auto
                  " map               map              " 256px
                  " editDescription   editDescription  " auto
                  / auto              1fr             ;
}

.postMemory {
  grid-area: postMemory;
  display: grid;
  grid-template:
    " inputText  inputText     " auto
    " .          postButton    " auto
    / auto       128px;
  margin-bottom: 48px;
}

.postButton {
  grid-area: postButton;
}

.editTitle {
  grid-area: editTitle;
  margin: 15px;
}

.editImage {
  grid-area: editImage;
  margin: 15px;
}

.editTaggedPeople {
  grid-area: editTaggedPeople;
  margin: 15px;
}

.editDescription {
  grid-area: editDescription;
  margin: 15px;
}
</style>

