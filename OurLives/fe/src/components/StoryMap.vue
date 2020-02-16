<template>
  <div class="google-map" :id="mapName"></div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import $Scriptjs from 'scriptjs';
import keys from './../common/keys';

const $ = require('jquery');

window.$ = $;
require('jquery-confirm');

export default {

  name: 'StoryMap',
  // Variables here

  props: ['coordinates', 'editEnabled', 'mapName'],

  mounted() {
    $Scriptjs(`https://maps.googleapis.com/maps/api/js?key=${keys.MAPS_API_KEY}`, () => {
      this.initMap();
    });
  },

  data() {
    return {
      markers: [],
      map: null,
      bounds: null,
    };
  },

  watch: {
    coordinates() {
      if (this.editEnabled) return;
      if (!this.coordinates) { return; }
      this.coordinates.forEach(((coordinate) => {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(coordinate.lat, coordinate.lng),
          map: this.map,
        });
        this.markers.push(marker);
      }));
      this.centerMap();
    },
  },

  methods: {
    initMap() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName);
      const mapCentre = { latitude: 41.015137, longitude: 28.979530 };
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
        maxZoom: 15,
      };
      const position = new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude);
      this.map = new google.maps.Map(element, options);
      this.map.setZoom(10);
      if (!this.editEnabled) return;
      this.map.addListener('click', ((e) => {
        const latlng = e.latLng;
        this.coordinates.push({ lat: latlng.lat(), lng: latlng.lng() });
        this.$emit('update', this.coordinates);
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

    centerMap() {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((coord) => {
        const position = new google.maps.LatLng(coord.position.lat(), coord.position.lng());
        this.map.fitBounds(bounds.extend(position));
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.google-map {
  margin: 15px;
  background: gray;
  grid-area: map;
}

</style>

