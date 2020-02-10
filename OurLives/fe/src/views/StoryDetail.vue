<template>
<div>
  <div id="Memory">
    <div class="memoryCell">
        <h3 class="title">{{ memory.title }}</h3>
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
          <memory-map :coordinates="coordinates"
                      :mapName="mapName">
          </memory-map>
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
          placeholder="Enter your annotation..."/>
        <div class="thumbnail">
          <img  v-if="memory.imgUrl"
                :src="memory.imgUrl"/>
        </div>
        <br>
    </div>
  </div>
</div>
</template>
<script>

import axios from 'axios';
import StoryService from './../services/StoryService';
import AnnotationService from './../services/AnnotationService';
import Memory from './../models/Memory';
import MemoryMap from './../components/MemoryMap.vue';

const $ = require('jquery');

window.$ = $;
require('jquery-confirm');

export default {
  name: 'StoryDetail',
  // Variables here
  props: ['name'],

  components: { MemoryMap },

  data() {
    return {
      memory: {},
      annotatedText: '',
      id: '',
      annotations: [],
      isPhotoLoaded: false,
      comment: '',
      clickedText: '',
      imageComments: [],
      mapName: `${this.name}-map`,
    };
  },

  // On Create here
  async created() {
    this.id = this.$attrs.id;
    await this.getMemory();
    this.getAnnotations();
  },

  // Setters here

  computed: {

    comments() {
      if (this.imageComments && this.imageComments.length !== 0) {
        return this.imageComments;
      }
      if (!this.clickedText || !this.textAnnotations) { return []; }
      let retval = [];
      try {
        retval = this.textAnnotations
          .filter(annotation => annotation.target.selector.exact.includes(this.clickedText))
          .map(annotation => ({ comment: annotation.body.value, author: annotation.creator.name }));
      } catch (e) {
        console.log(e);
      }
      return retval;
    },

    coordinates() {
      return this.memory.coords;
    },

    annotationTextObject() {
      if (!this.annotatedText) {
        return {};
      }
      const annotationObject = {
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        // annotationObject = Object.assign({"id":1}, annotationObject);
        type: 'Annotation',
        body: {
          type: 'TextualBody',
          value: this.comment,
          format: 'text/plain',
        },
        created: new Date().toISOString(),
        creator: { type: 'Human', name: sessionStorage['vue-session-key'] ? JSON.parse(sessionStorage['vue-session-key']).session_username : 'Anonymous' },
        generator: { type: 'Software', name: 'TheBeaver', homepage: `${window.location.protocol}//${window.location.host}` },
        motivation: 'tagging',
        target: {
          source: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
          selector: { type: 'TextQuoteSelector', exact: this.annotatedText },
        },
      };
      return annotationObject;
    },

    annotationImageObject() {
      if (!this.annotationImageRectRatio) {
        return {};
      }
      const annotationObject = {
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        type: 'Annotation',
        body: {
          type: 'TextualBody',
          value: this.comment,
          format: 'text/plain',
        },
        created: new Date().toISOString(),
        creator: { type: 'Human', name: sessionStorage['vue-session-key'] ? JSON.parse(sessionStorage['vue-session-key']).session_username : 'Anonymous' },
        generator: { type: 'Software', name: 'TheBeaver', homepage: `${window.location.protocol}//${window.location.host}` },
        motivation: 'tagging',
        target: {
          source: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
          id: `${this.memory.imgUrl}#xywh%3D${this.imgRatioText}`,
          type: 'Image',
          format: 'image/jpeg',
        },
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

    async getMemory() {
      await StoryService.getMemory(this.id, (res) => {
        this.memory = res.data[0];
      });
    },

    async getAnnotations() {
      AnnotationService.get(window.location.host + window.location.pathname, (res) => {
        this.annotations = res.data;
      });
    },

    dateToString(date) {
      return Memory.dateToString(date);
    },

    async annotate() {
      this.getTextAnnotation();
      if (this.annotationTextObject) {
        const res = await axios.post(
          `${this.annotationURL}/annotate`, { annotationObject: this.annotationTextObject },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
      }

      if (this.annotationImageObject) {
        const annotationObject = this.annotationImageObject;
        const res = await axios.post(
          `${this.annotationURL}/annotate`, { annotationObject },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
      }

      await this.getAnnotations();
    },
  },

};

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
  grid-template: "   .             .              .             " auto
                 "   title         title          title         " auto
                 "   thumbnail     thumbnail      thumbnail     " auto
                 "   description   description    description   " auto
                 "   comment       annotate       annotate      " auto
                 /    1fr          auto           auto;
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
