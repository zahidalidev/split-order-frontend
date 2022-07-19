import axios from 'axios'
import { nodeApi } from '../config/endPoint'

interface Register {
  fullName: string
  email: string
  number: string
  address: string
  password: string
  confirmPassword: string
}
interface Login {
  email: string
  password: string
}

export const addUser = async (body: Register) => await axios.post(`${nodeApi}/users`, body)

export const loginUser = async (body: Login) => await axios.post(`${nodeApi}/auth`, body)
