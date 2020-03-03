<template>
  <div class="addPhoto">
    <div class="photo">
      <img v-if="imgUrl" :src="imgUrl"/>
    </div>
    <image-uploader
        id="imageUploader"
        :preview="true"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        capture="environment"
        :debug="1"
        doNotResize="gif"
        :autoRotate="true"
        outputFormat="verbose"
        @input="setImage"
        style="display: none;">
      </image-uploader>
      <b-button class="addPhotoButton"
                variant="info"
                v-on:click="addPhoto">{{addPhotoButtonName}}
      </b-button>
    </div>
</template>

<script>

export default {

  name: 'AddPhoto',

  props: [],

  data() {
    return {
      image: { dataUrl: null },
    };
  },

  computed: {
    imgUrl() {
      return this.image.dataUrl;
    },

    hasImage() {
      return this.imgUrl !== null;
    },

    addPhotoButtonName() {
      return this.hasImage ? 'Replace' : 'Add Photo';
    },

  },

  methods: {
    setImage(output) {
      this.image = output;
      this.$emit('update', this.image.dataUrl);
    },

    addPhoto() {
      document.getElementById('imageUploader').click();
    },
  },
};
</script>

<style scoped>

.addPhoto {
  grid-area: editImage;
}

.photo img {
  height: 100%;
  max-width: 100%;
  max-height: 256px;
  object-fit: contain;
  margin: 8px;
}

.addPhotoButton {
  float: left;
  margin: 8px 0px;
}

</style>
