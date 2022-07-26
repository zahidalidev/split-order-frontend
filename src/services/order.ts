import axios from 'axios'
import { nodeApi } from '../config/endPoint'

const orderEndpoint = `${nodeApi}/order`

export const addOrder = async (body: Order) => await axios.post(orderEndpoint, body)

interface Order {
  mainUserId: string
  invitedUsers: [
    {
      userId: string
      orders: TempOrders[]
    }
  ]
}

interface TempOrders {
  itemId: string
  name: string
  price: Number
  quantity: Number
}
