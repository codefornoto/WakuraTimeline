<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import getGSData from '../services/getData'
import type { eventType } from '../types/event'
import { useRoute } from 'vue-router'
import { TITLE } from '../config'

const route = useRoute()

const loading = ref(true)
const id = (route.query.id as keyof typeof TITLE) ?? 'wakura'
const eventList = ref<eventType[]>([])
const title: string = (() => {
  return TITLE[id] ?? '未定義のタイトル'
})()
const isMobile = ref(window.innerWidth < 768)

async function fetchData() {
  const response = await getGSData(id)
  eventList.value = response
}

onMounted(async () => {
  setTimeout(() => {
    loading.value = false
  }, 3000)

  await fetchData()
})
</script>

<template>
  <main>
    <div v-if="loading" class="loader-container">
      <DotLottieVue
        src="https://lottie.host/0db29b43-8969-4d70-937f-73216901e4f9/1lIBGa3JSm.lottie"
        background="transparent"
        style="width: 300px; height: 300px"
        loop
        autoplay
      >
      </DotLottieVue>
    </div>
    <section class="intro">
      <div class="container">
        <h1>
          能登の年表 <br />
          〜{{ title }}〜
        </h1>
      </div>
    </section>
    <section class="timeline">
      <ul>
        <li
          v-for="(item, index) in eventList"
          :key="index"
          :eventList-position="item.category"
          :eventList-category="item.genre"
          :class="[
            'in-view',
            isMobile ? 'left' : item.category === '国' ? 'left' : 'right',
            item.genre === '災害' ? 'disaster' : '',
          ]"
        >
          <div>
            <time>{{ item.year }}</time> {{ item.era }} {{ item.event }}
            <img :src="item.image" style="width: 100%; height: auto" alt="" />
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<style>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.loader-container img {
  width: 100px;
  height: auto;
}
.hidden {
  display: none;
}
</style>
