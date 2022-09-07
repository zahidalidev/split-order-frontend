import axios from 'axios'
import { nodeApi } from '../config/endPoint'

const orderEndpoint = `${nodeApi}/order`

export const addOrder = async (body: Order) => await axios.post(orderEndpoint, body)

export const getOrders = async (id: string) => await axios.get(`${orderEndpoint}/${id}`)

export const clearAndSendOrder = async (body: Order[], token: string) =>
  await axios.post(
    `${orderEndpoint}/email`,
    { orders: body },
    {
      headers: {
        'x-auth-token': token
      }
    }
  )

export const removeOrderById = async (id: string, token: string) =>
  await axios.delete(`${orderEndpoint}/${id}`, {
    headers: {
      'x-auth-token': token
    }
  })

interface TempOrders {
  itemId: string
  name: string
  price: Number
  quantity: Number
}
interface Order {
  mainUserId: string
  invitedUsers: [
    {
      userId: string
      userName: string
      userEmail: string
      orders: TempOrders[]
    }
  ]
}
