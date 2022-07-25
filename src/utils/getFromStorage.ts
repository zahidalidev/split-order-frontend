import AsyncStorage from '@react-native-async-storage/async-storage'
import { Token, User } from './constants'

export const getToken = async () => await AsyncStorage.getItem(Token)
export const getStoreUser = async () => JSON.parse(await AsyncStorage.getItem(User))
