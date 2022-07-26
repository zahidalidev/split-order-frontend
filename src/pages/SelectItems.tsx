import { FC, useEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Constants from 'expo-constants'

import AppBar from '../components/AppBar'
import { getToken } from '../utils/getFromStorage'
import { getRestaurantItems } from '../services/restaurant'
import { Colors } from '../config/theme'
import { RootStackParams } from '../components/Routes'

// interface Props2 {
//   route: {
//     params: {
//       from_id: string
//       rest_id: string
//     }
//   }
// }

interface CurrentItems {
  __v: number
  _id: string
  name: string
  price: number
  restId: string
}

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const SelectItems: FC<Props> = (props: Props) => {
  const [currentRestItems, setCurrentRestItems] = useState<CurrentItems[]>([])

  const handleRestItems = async (restId: string) => {
    try {
      const token = await getToken()
      const { data } = await getRestaurantItems(restId, token || '')
      setCurrentRestItems(data)
    } catch (error) {}
  }

  useEffect(() => {
    console.log(props.route.params)
    handleRestItems(props.route.params.rest_id)
  }, [props.route.params])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <AppBar navigation={props.navigation} title='Select Items' />
      <Text>response.notification.request.content.data.from_id</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  }
})

export default SelectItems
