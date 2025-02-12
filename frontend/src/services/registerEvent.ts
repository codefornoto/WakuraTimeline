import { GAS_URL } from '../config'

export async function registerEvent(formData: FormData) {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Upload Result:", result);
    return result
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

