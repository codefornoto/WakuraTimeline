<template>
  <div class="leaflet-map">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="[inputLat, inputLon]"
      @click="moveMarker"
      :options="leafletMapOptions"
      style="width: 100%; height: 350px"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      >
      </l-tile-layer>
      <l-marker :lat-lng="[inputLat, inputLon]" />
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import { defineProps } from 'vue'

const props = defineProps({
  zoom: {
    type: Number,
    default: 14,
  },
  lat: {
    type: Number,
    default: 0,
  },
  long: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:lat', 'update:long'])

const inputLat = ref(props.lat)
const inputLon = ref(props.long)
const leafletMapOptions = {
  doubleClickZoom: false,
}
const moveMarker = (e: { latlng?: { lat: number; lng: number } }) => {
  if (!e.latlng) {
    return
  }
  inputLat.value = e.latlng.lat
  inputLon.value = e.latlng.lng
  emit('update:lat', inputLat.value)
  emit('update:long', inputLon.value)
}
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 350px;
}
</style>
