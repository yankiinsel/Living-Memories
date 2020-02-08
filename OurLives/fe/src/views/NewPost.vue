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
        <div class="google-map" :id="mapName"></div>
        <select-date v-on:update="updateMemoryDate">
        </select-date>
        <b-form-textarea class="editDescription"
                      type="text"
                      v-model="message"
                      placeholder="Enter your memory..."/>
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
import axios from 'axios';
import $Scriptjs from 'scriptjs';
import 'bootstrap/dist/css/bootstrap.css';
import StoryService from '../services/StoryService';
import Memory from '../models/Memory';
import SelectDate from '../components/SelectDate.vue';

export default {
  /* eslint-disable no-debugger */

  name: 'NewPost',
  // Variables here
  props: ['name'],

  components: {
    SelectDate,
  },

  mounted() {
    $Scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyDizCTlHkRUed4C1f2E1dQxOz2Y93qVBZk', () => {
      this.initMap();
    });
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
      baseURL: 'https://beaver-memories.now.sh',
      secondaryURL: 'https://beaver-annotations.now.sh',
      annotatedText: '',
      mapName: `${this.name}-map`,
      coordinates: [],
      map: null,
      bounds: null,
      markers: [],
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
    initMap() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName);
      const mapCentre = { latitude: 41.015137, longitude: 28.979530 };
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
      };
      const position = new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude);
      this.map = new google.maps.Map(element, options);
      this.map.setZoom(10);
      this.map.addListener('click', ((e) => {
        const latlng = e.latLng;
        this.coordinates.push({ lat: latlng.lat(), lng: latlng.lng() });
        const marker = new google.maps.Marker({
          position: latlng,
          map: this.map,
          draggable: true,
        });
        marker.addListener('click', ((e) => {
          const index = this.markers.map(x => x.position.lat())
            .indexOf(marker.position.lat());
          this.markers[index].setMap(null);
          this.markers.splice(index, 1);
        }));
        this.markers.push(marker);
      }));
    },

    getMemoryDate(date) {
      Memory.dateToString(date);
    },

    updateMemoryDate(value) {
      this.memoryDate = value;
    },

    async postMemory() {
      this.isLoading = true;
      const promise1 = new Promise((resolve, reject) => {
        if (this.coordinates) {
          this.coordinates.forEach(async (coordinate) => {
            try {
              const location = await axios.get(`https://beaver-geocode.now.sh/decode/${coordinate.lat}&${coordinate.lng}`);
              this.locs.push(location);
            } catch (e) {
              this.isLoading = false;
            }
          });
          setTimeout(resolve, 2000, this.locs);
        }
      });
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
  grid-template:
    ". postMemory ." auto
    ". memories  ." auto
    / 13% 1fr 13%;
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
  width: 100%;
  height: 100%;
}

.memoryCell {
  background-color: #ffffffbb !important;
  display: grid;
  grid-template:
    " thumbnail  title           .                 .            " auto
    " thumbnail  description     .                 .            " auto
    " thumbnail  .               view-annotations  .            " 1fr
    / auto 1fr auto auto;
  text-align: left;
  box-shadow: 3px 3px #0000001c;
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
                  " editLocation      editLocation     " 256px
                  " editDescription   editDescription  " auto
                  / auto              1fr             ;
}

.postMemory {
  grid-area: postMemory;
  display: grid;
  grid-template:
    " inputText  inputText     " auto
    " .          postButton    " auto
    / auto 128px;
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

.google-map {
  margin: 15px;
  background: gray;
  grid-area: editLocation;
}

</style>

