import axios from 'axios'
import { nodeApi } from '../config/endPoint'

const restEndpoint = `${nodeApi}/restaurant`

export const addRestaurant = async (name: string, token: string) =>
  await axios.post(
    restEndpoint,
    { name },
    {
      headers: {
        'x-auth-token': token
      }
    }
  )

export const getUserRestaurant = async (token: string) =>
  await axios.get(restEndpoint, {
    headers: {
      'x-auth-token': token
    }
  })

export const addItem = async (body: RestaurantItem, token: string) =>
  await axios.post(`${restEndpoint}/item`, body)

interface RestaurantItem {
  name: string
  price: number
  restId: string
}
