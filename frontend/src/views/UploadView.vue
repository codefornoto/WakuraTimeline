<template>
  <v-container>
    <v-form ref="form" @submit.prevent="uploadData">
      <h3>イベント登録</h3>

      <v-text-field v-model="year" label="年 (year)" required></v-text-field>

      <v-text-field v-model="era" label="時代 (era)" required></v-text-field>

      <v-text-field v-model="category" label="カテゴリ (category)" required> </v-text-field>

      <v-text-field v-model="event" label="イベント (event)" required></v-text-field>

      <v-text-field v-model="etc" label="詳細 (etc)"></v-text-field>

      <v-text-field v-model="genre" label="ジャンル (genre)"></v-text-field>

      <v-text-field v-model="reference" label="参照 (reference)"></v-text-field>

      <v-file-input v-model="image" label="画像 (image)" accept="image/*" required></v-file-input>

      <v-btn color="primary" type="submit">アップロード</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { registerEvent } from '@/services/registerEvent'

const form = ref(null)
const year = ref('')
const era = ref('')
const category = ref('')
const event = ref('')
const etc = ref('')
const genre = ref('')
const reference = ref('')
const image = ref<File | null>(null)

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const img = new Image()
      img.onload = function () {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        const dataURL = canvas.toDataURL('image/jpeg', 0.7)
        resolve(dataURL)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function uploadData() {
  const formData = new FormData()
  formData.append('year', year.value)
  formData.append('era', era.value)
  formData.append('category', category.value)
  formData.append('event', event.value)
  formData.append('etc', etc.value)
  formData.append('genre', genre.value)
  formData.append('reference', reference.value)

  if (image.value) {
    const compressedImage = await compressImage(image.value)
    formData.append('imageData', compressedImage.split(',')[1])
    formData.append('imageName', image.value.name)
  } else {
    alert('画像を選択してください')
    return
  }

  try {
    // formDataの内容をコンソールに出力
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })
    const response = await registerEvent(formData)

    if (response.status === 'success') {
      alert('アップロード成功！')
    } else {
      console.log(response)
      alert('アップロード失敗！')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('エラーが発生しました。')
  }
}
</script>
