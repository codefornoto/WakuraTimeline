<template>
  <v-container fluid>
    <h2 class="text-lg md:text-2xl">イベント登録</h2>
    <v-row>
      <v-col cols="0" md="3"></v-col>
      <v-col cols="12" md="6">
        <v-form ref="form" @submit.prevent="uploadData" class="upload-form">
          <v-row>
            <v-col cols="6" md="6" class="py-0">
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="year"
                    label="西暦(例: 1990)"
                    variant="outlined"
                    density="compact"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" md="6" class="py-0">
              <v-text-field
                v-model="era"
                label="和暦(例:平成2年)"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" class="pt-0 text-right">
              <small>※不明な場合は「～頃」「不詳」と入力してください。</small>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="event"
                label="思い出や出来事"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" class="py-0">
              <v-select
                v-model="category"
                :items="categories"
                label="カテゴリ (category)"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-text-field v-model="etc" label="備考" variant="outlined" density="compact" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" class="py-0">
              <v-file-input
                v-model="image"
                label="画像 (image)"
                accept="image/*"
                variant="outlined"
                @change="previewImage"
                class="flex-1 mr-2"
                density="compact"
              >
              </v-file-input>
            </v-col>
            <v-col cols="12" md="8" class="py-0">
              <img
                v-if="thumbnail"
                :src="thumbnail"
                alt="サムネイル"
                class="w-full max-w-xs"
                width="350px"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="latitude"
                    label="緯度"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="longitude"
                    label="経度"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="8" class="py-0">
              <LeafletMap
                :lat="latitude"
                :long="longitude"
                @update:lat="
                  (value: number) => {
                    latitude = value
                  }
                "
                @update:long="
                  (value: number) => {
                    longitude = value
                  }
                "
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" type="submit" :disabled="isSubmitting" block>
                アップロード
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

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
import { useRoute } from 'vue-router'
import { compressImage } from '@/utils/imageUtils'
import LeafletMap from '../components/LeafletMap.vue'

const form = ref(null)
const year = ref('')
const era = ref('')
const latitude = ref(37.39225471283128)
const longitude = ref(136.9037461280823)

const category = ref('郷土')
const event = ref('')
const etc = ref('')
const genre = ref('')
const reference = ref('')
const image = ref<File | null>(null)
const thumbnail = ref<string | null>(null)
const isSubmitting = ref(false)
const successDialog = ref(false)

const route = useRoute()
const id = route.query.id ?? 'wakura'
// カテゴリの選択肢
const categories = ['郷土', '国']

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
    formData.append('imageData', '')
    formData.append('imageName', '')
  }
  formData.append('latitude', latitude.value.toString())
  formData.append('longitude', longitude.value.toString())
  try {
    const response = await registerEvent(formData, id as string)

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

<style scoped></style>
