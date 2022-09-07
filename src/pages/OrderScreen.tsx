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
import Constants from 'expo-constants'
import { useToast } from 'react-native-styled-toast'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { getStoreUser, getToken } from '../utils/getFromStorage'
import AppBar from '../components/appBar'
import { Colors, toastTheme } from '../config/theme'
import { RootStackParams } from '../components/routes'
import Button from '../components/common/Button'
import { clearAndSendOrder, getOrders } from '../services/order'
import LoadingModal from '../components/common/LoadingModal'
import { getDataWithTotalCharges } from '../utils/constants'
import { removeOrderById } from '../services/order'

interface TempOrders {
  itemId: string
  name: string
  price: number
  quantity: number
}
interface UserOrder {
  _id: string
  mainUserId: string
  invitedUsers: [
    {
      userId: string
      userName: string
      userCharges: number
      userEmail: string
      orders: TempOrders[]
    }
  ]
}

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const Order: FC<Props> = (props: Props) => {
  const [currentItems, setCurrentItems] = useState<UserOrder[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, showLoading] = useState(false)
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
      showLoading(true)
      const user = await getStoreUser()
      const { data } = await getOrders(user._id)
      const { dataWithCharges, totalCharges } = getDataWithTotalCharges(data)
      setCurrentItems(dataWithCharges)
      setTotalAmount(totalCharges)
    } catch (error) {
      toast({ message: 'Getting order error!', ...toastTheme.error })
    }
    showLoading(false)
  }

  const handleSubmit = async () => {
    try {
      showLoading(true)
      const token = await getToken()
      await clearAndSendOrder(currentItems, token || '')
      currentItems.forEach(async item => {
        await handleRemoveCard(item._id, false)
      })
      setCurrentItems([])
      toast({ message: 'Emails Sent!' })
    } catch (error) {
      toast({ message: 'Failed to send email!', ...toastTheme.error })
    }
    showLoading(false)
  }

  const handleRemoveCard = async (_id: string, alert: boolean = true) => {
    showLoading(true)
    let oldItemsTemp = [...currentItems]
    let currentItemsTemp = [...currentItems]
    currentItemsTemp = currentItemsTemp.filter(item => item._id !== _id)
    setCurrentItems(currentItemsTemp)
    try {
      const token = await getToken()
      await removeOrderById(_id, token || '')
      if (alert) {
        toast({ message: 'Order removed!' })
      }
    } catch (error) {
      toast({ message: 'Failed to remove order!', ...toastTheme.error })
      setCurrentItems(oldItemsTemp)
    }
    showLoading(false)
  }

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

  const itemComponent = (item: UserOrder) =>
    item.invitedUsers.map((user, index) => (
      <View key={index.toString()} style={styles.itemContainer}>
        <TouchableOpacity onPress={() => handleRemoveCard(item._id)} style={styles.removeCard}>
          <MaterialCommunityIcons
            name='delete-forever'
            size={RFPercentage(3)}
            color={Colors.danger}
          />
        </TouchableOpacity>
        <View style={styles.userOrderSummaryHeading}>
          <Text style={styles.orerUserSummary}>Order of {user.userName}</Text>
          <Text style={styles.orerUserSummary}>Total amount ({user.userCharges} PKR)</Text>
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
    width: '90%',
    marginLeft: '5%',
    marginTop: RFPercentage(1),
    marginBottom: RFPercentage(2),
    backgroundColor: Colors.white,
    elevation: 3,
    borderRadius: 5
  },

  itemHeadingContainer: {
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5,
    elevation: 0
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
    paddingBottom: RFPercentage(4),
    alignItems: 'center',
    backgroundColor: Colors.lightGrey2,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 20,
    borderTopRightRadius: RFPercentage(3),
    borderTopLeftRadius: RFPercentage(3),
    borderTopWidth: 1,
    borderTopColor: Colors.grey
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
    marginTop: RFPercentage(2),
    marginBottom: RFPercentage(20)
  },

  userOrderSummaryHeading: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: RFPercentage(1)
  },

  totalAmountWrapper: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'flex-start',
    marginTop: RFPercentage(1)
  },

  totalAmount: {
    fontSize: RFPercentage(2.2),
    marginBottom: RFPercentage(2)
  },

  totalAmountPkr: {
    marginLeft: 5,
    fontWeight: '500'
  },

  removeCard: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: RFPercentage(1),
    top: RFPercentage(1)
  }
})

export default Order
