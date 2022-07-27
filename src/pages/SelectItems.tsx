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
import { addOrder } from '../services/order'
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

const SelectItems: FC<Props> = (props: Props) => {
  const [currentItems, setCurrentItems] = useState<CurrentItems[]>([])
  const [showSelectItemModal, setShowSelectItemModal] = useState(false)
  const [restId, setRestId] = useState('')
  const [formId, setFormId] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setRestId(props.route.params.rest_id)
    setFormId(props.route.params.from_id)
  }, [])

  const handleDecrement = (index: number) => {
    const tempItems = [...currentItems]
    if (tempItems[index].quantity > 0) {
      tempItems[index].quantity -= 0.5
      setCurrentItems(tempItems)
    }
  }

  const handleIncrement = (index: number) => {
    const tempItems = [...currentItems]
    tempItems[index].quantity += 0.5
    setCurrentItems(tempItems)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const tempOrders: TempOrders[] = []
      currentItems.forEach(item => {
        tempOrders.push({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })
      })

      const user = await getStoreUser()
      const body: Order = {
        mainUserId: formId,
        invitedUsers: [
          {
            userId: user._id,
            orders: tempOrders
          }
        ]
      }
      await addOrder(body)
      toast({ message: 'Order Submited' })
    } catch (error) {
      toast({ message: 'Error, Order not submited, Try again', ...toastTheme.error })
    }
    setLoading(false)
  }

  const ItemComponent = (item: CurrentItems, index: number) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemWrapper}>
        <Text style={styles.itemLabel}>{item.name}</Text>
        <Text style={styles.itemLabel}>{item.price} pkr</Text>
        <View style={styles.quantityWrapper}>
          <Button
            name='-'
            disable={item.quantity === 0}
            handleSubmit={() => handleDecrement(index)}
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
            handleSubmit={() => handleIncrement(index)}
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
      <ItemSelectModal
        show={showSelectItemModal}
        restId={restId || ''}
        setShowItemModal={setShowSelectItemModal}
        selectItems={setCurrentItems}
      />
      <View style={styles.headingContainer}>
        <View style={styles.restHeadingWrap}>
          <Text style={styles.restHeading}>Select Items</Text>
          <View style={styles.headingIconContainer}>
            <TouchableOpacity
              onPress={() => setShowSelectItemModal(true)}
              activeOpacity={0.7}
              style={styles.itemAddIcon}
            >
              <Badge
                size={18}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -5,
                  backgroundColor: Colors.primary
                }}
              >
                {currentItems.length}
              </Badge>
              <MaterialCommunityIcons name='food' color={Colors.primary} size={RFPercentage(3.5)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
          name='Submit'
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

  restHeadingWrap: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    backgroundColor: Colors.white,
    padding: RFPercentage(2)
  },

  restHeading: {
    width: '50%',
    fontSize: RFPercentage(3),
    alignSelf: 'flex-start',
    marginTop: RFPercentage(2),
    marginBottom: RFPercentage(2),
    fontWeight: '600',
    color: Colors.secondary
  },

  itemAddIcon: {
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 5,
    elevation: 5
  },

  headingIconContainer: {
    flexDirection: 'row'
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

export default SelectItems
