import { FC, useEffect, useState } from 'react'
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Badge } from 'react-native-paper'
import Constants from 'expo-constants'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { getStoreUser, getToken } from '../utils/getFromStorage'
import { useToast } from 'react-native-styled-toast'
import AppBar from '../components/appBar'
import { Colors, toastTheme } from '../config/theme'
import { RootStackParams } from '../components/routes'
import Button from '../components/common/Button'
import { RFPercentage } from 'react-native-responsive-fontsize'
import ItemSelectModal from '../components/itemSelectModal'
import { addOrder, getOrders } from '../services/order'
import LoadingModal from '../components/common/LoadingModal'

interface CurrentItems {
  __v: number
  _id: string
  name: string
  price: number
  restId: string
  selected: boolean
  quantity: number
}

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
      orders: TempOrders[]
    }
  ]
}

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const Order: FC<Props> = (props: Props) => {
  const [currentItems, setCurrentItems] = useState<CurrentItems[]>([])
  const [showSelectItemModal, setShowSelectItemModal] = useState(false)
  const [restId, setRestId] = useState('')
  const [formId, setFormId] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleOrders = async () => {
    try {
      const user = await getStoreUser()
      const { data } = await getOrders(user._id)
      console.log('orders: ', data)
    } catch (error) {
      toast({ message: 'Getting order error!', ...toastTheme.error })
    }
  }

  useEffect(() => {
    handleOrders()
  }, [])

  const ItemComponent = (item: CurrentItems, index: number) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemWrapper}>
        <Text style={styles.itemLabel}>{item.name}</Text>
        <Text style={styles.itemLabel}>{item.price} pkr</Text>
        <View style={styles.quantityWrapper}>
          <Button
            name='-'
            disable={item.quantity === 0}
            // handleSubmit={() => handleDecrement(index)}
            fontSize={RFPercentage(3.3)}
            width={RFPercentage(4)}
            height={RFPercentage(4)}
            backgroundColor={Colors.danger}
          />
          <View style={styles.itemQuantity}>
            <Text
              style={[styles.quantity, { color: item.quantity ? Colors.black : Colors.danger }]}
            >
              {item.quantity}
            </Text>
          </View>
          <Button
            name='+'
            // handleSubmit={() => handleIncrement(index)}
            width={RFPercentage(4)}
            height={RFPercentage(4)}
            backgroundColor={Colors.primary}
          />
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <AppBar navigation={props.navigation} title='Name' />
      <LoadingModal show={loading} />
      <View style={[styles.itemContainer, styles.itemHeadingContainer]}>
        <View style={styles.itemWrapper}>
          <Text style={styles.itemLabelTitle}>Name</Text>
          <Text style={styles.itemLabelTitle}>Price</Text>
          <View style={styles.quantityWrapper}>
            <Text style={styles.itemLabelTitle}>Quantity</Text>
          </View>
        </View>
      </View>
      {currentItems.length !== 0 ? (
        <FlatList
          data={currentItems}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => ItemComponent(item, index)}
        />
      ) : (
        <View style={styles.itemNot}>
          <Text style={styles.itemNotDesc}>No Item Selected!</Text>
        </View>
      )}

      <View style={styles.orderBtn}>
        <Button
          name='Clear'
          // handleSubmit={handleSubmit}
          backgroundColor={Colors.primary}
          width='80%'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: Colors.white
  },

  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'space-around'
  },

  itemContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: RFPercentage(1.5)
  },

  itemHeadingContainer: {
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5
  },

  itemWrapper: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5,
    padding: RFPercentage(2)
  },

  itemQuantity: {
    width: RFPercentage(2.5),
    justifyContent: 'center',
    alignItems: 'center'
  },

  quantity: {
    fontSize: RFPercentage(2.2)
  },

  headingContainer: {
    width: '100%',
    alignItems: 'center',
    elevation: 2
  },

  itemLabel: {
    fontSize: RFPercentage(2.2)
  },

  itemLabelTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: '600'
  },

  itemNot: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFPercentage(5)
  },

  itemNotDesc: {
    fontSize: RFPercentage(3),
    color: Colors.grey
  },

  orderBtn: {
    position: 'absolute',
    bottom: RFPercentage(4),
    alignItems: 'center',
    left: 0,
    right: 0
  }
})

export default Order
