import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { useToast } from 'react-native-styled-toast'
import CheckBox from 'expo-checkbox'

import { Colors, toastTheme } from '../config/theme'
import { getRestaurantItems } from '../services/restaurant'
import { getToken } from '../utils/getFromStorage'
import Button from './common/Button'
import LoadingModal from './common/LoadingModal'

interface Props {
  show: boolean
  restId: string
  setShowItemModal: Function
  selectItems: Dispatch<SetStateAction<CurrentItems[]>>
}

interface CurrentItems {
  __v: number
  _id: string
  name: string
  price: number
  restId: string
  selected: boolean
  quantity: number
}

const ItemSelectModal: FC<Props> = ({ show, restId, setShowItemModal, selectItems }: Props) => {
  const [loading, showLoading] = useState(false)
  const [items, setItems] = useState<CurrentItems[]>([])
  const { toast } = useToast()

  useEffect(() => {
    handleAllRestItems()
  }, [restId])

  const handleAllRestItems = async () => {
    try {
      showLoading(true)
      const token = await getToken()
      console.log('restId modal: ', restId)
      const { data } = await getRestaurantItems(restId, token || '')
      setItems(data)
    } catch (error) {
      if (restId) {
        toast({ message: 'Gettting items error!', ...toastTheme.error })
      }
    }
    showLoading(false)
  }

  const handleItemsSelect = (index: number, value: boolean) => {
    const tempItems = [...items]
    tempItems[index].selected = value
    setItems(tempItems)
  }

  const handleSelectedItems = () => {
    setShowItemModal(false)
    const tempItems: CurrentItems[] = []
    items.forEach(item => {
      if (item.selected) {
        item.quantity = 0
        tempItems.push(item)
      }
    })
    selectItems(tempItems)
  }

  return (
    <Modal visible={show} transparent={true} style={styles.modelContainer}>
      <LoadingModal show={loading} />
      <View style={styles.backdropModel}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemDetailsHeading}>Select users to add</Text>
          <ScrollView style={styles.userContainerScroll}>
            <View style={styles.itemScrollContainer}>
              {items.map((item, index) => (
                <View key={item._id} style={styles.itemCheckContaienr}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text numberOfLines={1} style={styles.itemPrice}>
                    {item.price} pkr
                  </Text>
                  <CheckBox
                    style={styles.checkbox}
                    value={item.selected}
                    onValueChange={newValue => handleItemsSelect(index, newValue)}
                    color={item.selected ? Colors.primary : undefined}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
          <Button
            name='Add Selected Users'
            width='60%'
            backgroundColor={Colors.primary}
            height={RFPercentage(5)}
            ButtonStyle={styles.btnStyle}
            handleSubmit={handleSelectedItems}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  backdropModel: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemContainer: {
    elevation: 5,
    zIndex: 1,
    width: RFPercentage(40),
    height: RFPercentage(39),
    borderRadius: 5,
    backgroundColor: Colors.white,
    justifyContent: 'flex-start'
  },

  itemDetailsHeading: {
    fontSize: RFPercentage(3),
    fontWeight: '500',
    alignSelf: 'center',
    margin: RFPercentage(3),
    marginBottom: RFPercentage(1),
    borderBottomWidth: 2,
    width: '90%',
    textAlign: 'center',
    borderBottomColor: Colors.lightGrey2,
    paddingBottom: 7
  },

  userContainerScroll: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: RFPercentage(10)
  },

  itemScrollContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemCheckContaienr: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: RFPercentage(2)
  },

  itemName: {
    fontSize: RFPercentage(2.1),
    textAlign: 'left',
    width: '20%'
  },

  itemPrice: {
    fontSize: RFPercentage(2.1),
    marginLeft: 10,
    width: '50%',
    textAlign: 'left'
  },

  checkbox: {
    width: RFPercentage(2),
    height: RFPercentage(2),
    marginLeft: 10
  },

  btnStyle: {
    position: 'absolute',
    bottom: RFPercentage(3),
    alignSelf: 'center'
  }
})

export default ItemSelectModal
