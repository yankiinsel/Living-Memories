<template>
<div>
  <div id="Memory">
    <div class="memoryCell">
        <p class="title">{{ memory.title }}</p>
        <!-- <p v-html="memory.description"> -->
        <div class="description">
          <p :searchWords="queries" class="memory-description">
            {{ memory.description }}
          </p>
          <p v-if="memory.username" class="memory-username">
            {{ 'Author: ' + memory.username }}
          </p>
          <p v-if="memory.location" class="memory-location">
            {{ 'Location: ' + memory.location }}
          </p>
          <div class="google-map" :id="mapName"></div>
          <p v-if="memory.taggedPeople" class="memory-people">
            {{ 'People: ' + memory.taggedPeople }}
          </p>
          <p v-if="memory.date" class="memory-time">
            {{ 'Date: ' + dateToString(memory.date) }}
          </p>
        </div>
        <!-- </p> -->
        <b-button class="annotate"
                variant="info"
                @click="annotate()">Annotate
        </b-button>
         <b-form-textarea
          class="comment"
          type="text"
          v-model="comment"
          placeholder="Enter your annotation..."
        />
        <div class="thumbnail">
          <img @photo-loaded="photoLoaded"
                v-if="memory.imgUrl"
                :img-url="memory.imgUrl"
                ref="memoryImage"/>
        </div>
        <br>
    </div>
  </div>
</div>
</template>
<script>

import axios from 'axios';
import $Scriptjs from 'scriptjs';
import StoryService from './../services/StoryService';
import AnnotationService from './../services/AnnotationService';
import Memory from './../models/Memory';

const $ = require('jquery');

window.$ = $;
require('jquery-confirm');

export default {
  name: 'StoryDetail',
  // Variables here
  props: ['name'],

  mounted() {
    $Scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyDizCTlHkRUed4C1f2E1dQxOz2Y93qVBZk', () => {
      this.initMap();
    });
  },

  components: {
  },

  data() {
    return {
      memory: {},
      annotatedText: '',
      id: '',
      annotations: [],
      annotationImageRectRatio: {},
      annotationImageRect: {},
      isPhotoLoaded: false,
      mapName: `${this.name}-map`,
      map: null,
      bounds: null,
      markers: [],
      comment: '',
      clickedText: '',
      imageComments: [],
    };
  },

  // On Create here
  async created() {
    this.id = this.$attrs.id;
    await this.getMemory();
    this.getAnnotations();
  },

  // Setters here
  watch: {
    /* eslint-disable */

    coordinates() {
      if (!this.coordinates) { return []; };
      this.coordinates.forEach((coordinate => {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coordinate.lat, coordinate.lng),
            map: this.map
          });
          this.markers.push(marker);
        }).bind(this));
      this.centerMap();
    },
  },

  computed: {

    comments() {
      if (this.imageComments && this.imageComments.length !== 0) {
        return this.imageComments;
      }
      if (!this.clickedText || !this.textAnnotations) {return;};
      this.textAnnotations.forEach(anno => {
      });
      try {
        var a = this.textAnnotations
                .filter(annotation => annotation.target.selector.exact.includes(this.clickedText))
                .map(annotation => { return {comment: annotation.body.value, author: annotation.creator.name} });
      } catch (e) {
        console.log(e);
      }
      return a;
    },

    coordinates() {
        return this.memory.coords;
    },

    annotationTextObject() {
      if (!this.annotatedText) {
        return {};
      }
      let annotationObject = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      // annotationObject = Object.assign({"id":1}, annotationObject);
      "type": "Annotation",
      "body": {
        "type": "TextualBody",
        "value": this.comment,
        "format": "text/plain"
      },
      "created":new Date().toISOString(),
      "creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"},
      "generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host},
      "motivation":"tagging",
      "target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                          "selector":{"type": "TextQuoteSelector","exact": this.annotatedText }},
      }
      return annotationObject;
    },

    annotationImageObject() {
      if (!this.annotationImageRectRatio) {
        return {};
      }
      let annotationObject = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
        "type": "Annotation",
        "body": {
          "type": "TextualBody",
          "value": this.comment,
          "format": "text/plain"
        },
        "created":new Date().toISOString(),
        "creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"},
        "generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host},
        "motivation":"tagging",
        "target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                  "id": this.memory.imgUrl+"#xywh%3D"+this.imgRatioText,
                  "type": "Image",
                  "format": "image/jpeg",
        }
      };
      return annotationObject;
    },

    textAnnotations() {
      return this.annotations.filter(annotation => annotation.target.selector && annotation.target.selector.type === 'TextQuoteSelector');
    },

    queries() {
      return this.textAnnotations.map(annotation => annotation.target.selector.exact);
    },
   },


  // Methods here
  methods: {

    initMap() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName)
      let mapCentre = {latitude: 41.015137, longitude: 28.979530}
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
        maxZoom: 15,
      }
      const position = new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude);
      this.map = new google.maps.Map(element, options);
      this.map.setZoom(10);
    },

    centerMap() {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((coord) => {
        const position = new google.maps.LatLng(coord.position.lat(), coord.position.lng());
        this.map.fitBounds(bounds.extend(position))
      });
    },

    photoLoaded() {
      // setInterval is necessary to ensure browser paints
      // the image, b/c img onload does not take paint into acccount
      // when being fired;
      const resetInterval = setInterval(() => {
        if (this.$refs.memoryImage.$refs) {
          this.isPhotoLoaded = true;
          clearInterval(resetInterval);
        }
      }, 100);
    },

    async getMemory() {
      await StoryService.getMemory(this.id, (res) => {
            this.memory = res.data[0];
        });
    },

    async getAnnotations() {
      AnnotationService.get(window.location.host+window.location.pathname, () => {
        this.annotations = res.data;
      });
    },

    dateToString(date) {
      return Memory.dateToString(date);
    },

    async annotate() {

      this.getTextAnnotation()
      if (this.annotationTextObject) {
        const res = await axios.post(
          `${this.annotationURL}/annotate`, {annotationObject: this.annotationTextObject},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
      }

      if (this.annotationImageObject) {
        let annotationObject = this.annotationImageObject;
        const res = await axios.post(
          `${this.annotationURL}/annotate`, {annotationObject},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
      }

      await this.getAnnotations();
    },
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  grid-template: " thumbnail  .             .              .             " auto
                 " thumbnail  title         title          title         " auto
                 " thumbnail  description   description    description   " auto
                 " comment    comment       annotate       annotate      " auto
                 / auto       1fr           auto       auto;
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

/*
.thumbnail img {
  width: 256px;
  height: auto;
} */

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

.annotate {
  grid-area: annotate;
  padding-bottom: 15px;
  margin: 15px;
}

.deleteButton {
  grid-area: deleteButton;
}

.google-map {
  margin: 15px;
  background: gray;
  grid-area: map;
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
.comment {
  grid-area: comment;
  padding-bottom: 15px;
  margin: 15px;
}

.annotationComments {
  grid-area: annotations;
  margin: 15px;
  align-self: start;
}



</style>
