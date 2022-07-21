import AsyncStorage from '@react-native-async-storage/async-storage'
import { Token } from './constants'

export const getToken = async () => await AsyncStorage.getItem(Token)
