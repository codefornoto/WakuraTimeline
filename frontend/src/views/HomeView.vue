<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import getGSData from '../services/getData'
import type { eventType } from '../types/event'
import { useRoute } from 'vue-router'
const route = useRoute()

const id = route.query.id as string ?? "test"
const data = ref<eventType[]>([])
const title = (id === "monzen" ? "～輪島市門前町~" : "~七尾~")
const isMobile = ref(window.innerWidth < 768)

async function fetchData() {
  const response = await getGSData(id)
  data.value = response
}

onMounted(async () => {
  const loader = document.getElementById('loader')
  const content = document.getElementById('content')

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden')
      }
      if (content) {
        content.style.display = 'block'
      }
    }, 5000)
  })

  await fetchData()
})
</script>

<template>
  <main>
    <div class="loader-container" id="loader">
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
          {{ title }}
        </h1>
      </div>
    </section>
    <section class="timeline">
      <ul>
        <li
          v-for="(item, index) in data"
          :key="index"
          :data-position="item.category"
          :data-category="item.genre"
          :class="[
            'in-view',
            isMobile ? 'left' : (item.category === '国' ? 'left' : 'right'),
            item.genre === '災害' ? 'disaster' : '',
          ]"
        >
          <div>
            <time>{{ item.year }}</time> {{ item.era }} {{ item.event }}
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
