<template>
  <v-container>
    <h3>登録されたイベント</h3>
    <v-data-table :items="events" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>イベント一覧</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.image="{ item }">
        <v-img :src="item.image" max-width="100" max-height="100" />
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGSData } from '@/services/getData'

interface Event {
  year: string
  era: string
  category: string
  event: string
  etc: string
  genre: string
  reference: string
  image: string
}

const events = ref<Event[]>([])
const headers = [
  { text: '年', value: 'year' },
  { text: '時代', value: 'era' },
  { text: 'カテゴリ', value: 'category' },
  { text: 'イベント', value: 'event' },
  { text: '詳細', value: 'etc' },
  { text: 'ジャンル', value: 'genre' },
  { text: '参照', value: 'reference' },
  { text: '画像', value: 'image', sortable: false },
]

async function fetchEvents() {
  try {
    const response = await getGSData('Events') // シート名を指定
    events.value = response
  } catch (error) {
    console.error('エラー:', error)
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
/* スタイルを必要に応じて追加 */
</style>
