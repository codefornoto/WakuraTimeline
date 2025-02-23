import { GAS_URL } from '../config'
import type { eventType } from '../types/event'

interface gasResponse {
  status: string
  data: eventType[]
}

export const getGSData = async (id: string) => {
  try {
    const response = await fetch(`${GAS_URL}?sheetName=${id}`, {
      method: 'GET',
    })
    const data: gasResponse = await response.json()

    if (data.status === 'success') {
      console.log(data.data)
      return data.data
    }
    throw new Error('Failed to fetch markers')
  } catch (error) {
    console.error('Error fetching markers:', error)
    return []
  }
}

export default getGSData;
