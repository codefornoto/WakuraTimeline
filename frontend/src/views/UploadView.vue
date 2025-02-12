<template>
  <v-container fluid class="p-4 md:p-8">
    <v-form ref="form" @submit.prevent="uploadData" class="upload-form">
      <h3 class="text-lg md:text-2xl">イベント登録</h3>
      <v-text-field
        v-model="year"
        label="年 (year)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="era"
        label="時代 (era)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="category"
        label="カテゴリ (category)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="event"
        label="イベント (event)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="etc"
        label="詳細 (etc)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="genre"
        label="ジャンル (genre)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <v-text-field
        v-model="reference"
        label="参照 (reference)"
        variant="underlined"
        class="mb-4"
      ></v-text-field>
      <div class="flex items-center mb-4 flex-col md:flex-row">
        <v-file-input
          v-model="image"
          label="画像 (image)"
          accept="image/*"
          variant="underlined"
          @change="previewImage"
          class="flex-1 mr-2"
        >
        </v-file-input>
        <img
          v-if="thumbnail"
          :src="thumbnail"
          alt="サムネイル"
          class="w-full max-w-xs"
          width="350px"
        />
      </div>
      <v-btn color="primary" type="submit" :disabled="isSubmitting">アップロード</v-btn>
    </v-form>

    <v-dialog v-model="isSubmitting" persistent>
      <v-card>
        <v-card-title>アップロード中...</v-card-title>
        <v-card-text>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="successDialog" persistent>
      <v-card>
        <v-card-title>アップロード成功！</v-card-title>
        <v-card-actions>
          <v-btn color="primary" @click="successDialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const thumbnail = ref<string | null>(null)
const isSubmitting = ref(false)
const successDialog = ref(false)

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

async function previewImage() {
  if (image.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnail.value = e.target?.result as string
    }
    reader.readAsDataURL(image.value)
  } else {
    thumbnail.value = null
  }
}

async function uploadData() {
  isSubmitting.value = true
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
    isSubmitting.value = false
    return
  }

  try {
    // formDataの内容をコンソールに出力
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })
    const response = await registerEvent(formData)

    if (response.status === 'success') {
      successDialog.value = true
    } else {
      console.log(response)
      alert('アップロード失敗！')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('エラーが発生しました。')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.upload-form {
  max-width: 600px; /* 最大幅を設定 */
  margin: auto; /* 中央揃え */
}
</style>
