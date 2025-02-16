import { GAS_URL } from '../config'

export async function registerEvent(formData: FormData, sheetName: string) {
  try {
    const response = await fetch(`${GAS_URL}?sheetName=${sheetName}`, {
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

