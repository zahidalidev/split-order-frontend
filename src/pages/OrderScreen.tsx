import { FC, useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
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
import { getTotalCharges, invitedUserBill } from '../utils/constants'

interface TempOrders {
  itemId: string
  name: string
  price: number
  quantity: number
}
interface UserOrder {
  mainUserId: string
  invitedUsers: [
    {
      userId: string
      userName: string
      orders: TempOrders[]
    }
  ]
}

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const Order: FC<Props> = (props: Props) => {
  const [currentItems, setCurrentItems] = useState<UserOrder[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    handleOrders()
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await handleOrders()
    setRefreshing(false)
  }, [])

  const handleOrders = async () => {
    try {
      setLoading(true)
      const user = await getStoreUser()
      const { data } = await getOrders(user._id)
      setCurrentItems(data)
      setTotalAmount(getTotalCharges(data))
    } catch (error) {
      toast({ message: 'Getting order error!', ...toastTheme.error })
    }
    setLoading(false)
  }

  const handleSubmit = () => {}

  const OrderHeading = () => (
    <View style={[styles.itemContainer, styles.itemHeadingContainer]}>
      <View style={styles.itemWrapper}>
        <Text style={styles.itemLabelTitle}>Name</Text>
        <Text style={styles.itemLabelTitle}>Price</Text>
        <View style={styles.quantityWrapper}>
          <Text style={styles.itemLabelTitle}>Quantity</Text>
        </View>
      </View>
    </View>
  )

  const orderComponent = (item: TempOrders) => (
    <View key={item.itemId} style={styles.itemWrapper}>
      <Text style={styles.itemLabel}>{item.name}</Text>
      <Text style={styles.itemLabel}>{item.price} pkr</Text>
      <View style={styles.quantityWrapper}>
        <Text style={[styles.quantity, { color: item.quantity ? Colors.black : Colors.danger }]}>
          {item.quantity}
        </Text>
      </View>
    </View>
  )

  const itemComponent = ({ invitedUsers }: UserOrder) =>
    invitedUsers.map((user, index) => (
      <View key={index.toString()} style={styles.itemContainer}>
        <View style={styles.userOrderSummaryHeading}>
          <Text style={styles.orerUserSummary}>Order of {user.userName}</Text>
          <Text style={styles.orerUserSummary}>
            Total amount ({invitedUserBill(user.orders)} PKR)
          </Text>
        </View>
        <OrderHeading />
        {user.orders.map(item => orderComponent(item))}
      </View>
    ))

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <AppBar navigation={props.navigation} title='All Orders' />
      <LoadingModal show={loading} />
      <View style={styles.orderContainer}>
        {currentItems.length !== 0 ? (
          <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={currentItems}
            renderItem={({ item }) => itemComponent(item)}
          />
        ) : (
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={styles.itemNot}
          >
            <Text style={styles.itemNotDesc}>No Orders yet!</Text>
          </ScrollView>
        )}
      </View>

      <View style={styles.orderBtn}>
        <View style={styles.totalAmountWrapper}>
          <Text style={styles.totalAmount}>Total amount</Text>
          <Text style={[styles.totalAmount, styles.totalAmountPkr]}>{totalAmount} PKR</Text>
        </View>
        <Button
          name='Clear & Send Email'
          handleSubmit={handleSubmit}
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
    marginTop: RFPercentage(0.5)
  },

  itemHeadingContainer: {
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5
  },

  itemWrapper: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5,
    padding: RFPercentage(2)
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
    height: '100%',
    width: '100%'
  },

  itemNotDesc: {
    fontSize: RFPercentage(3),
    color: Colors.grey,
    alignSelf: 'center',
    marginTop: RFPercentage(5)
  },

  orderBtn: {
    position: 'absolute',
    bottom: RFPercentage(4),
    alignItems: 'center',
    left: 0,
    right: 0
  },

  orerUserSummary: {
    fontSize: RFPercentage(2.3),
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: RFPercentage(3),
    color: Colors.primary
  },

  orderContainer: {
    marginTop: RFPercentage(2)
  },

  userOrderSummaryHeading: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  totalAmountWrapper: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'flex-start'
  },

  totalAmount: {
    fontSize: RFPercentage(2.2),
    marginBottom: RFPercentage(2)
  },

  totalAmountPkr: {
    marginLeft: 5,
    fontWeight: '500'
  }
})

export default Order
