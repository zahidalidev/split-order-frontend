import axios from 'axios'
import { nodeApi } from '../config/endPoint'

export const addRestaurant = async (name: string, token: string) =>
  await axios.post(
    `${nodeApi}/restaurant`,
    { name },
    {
      headers: {
        'x-auth-token': token
      }
    }
  )
