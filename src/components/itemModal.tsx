import React, { FC, useState } from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { useToast } from 'react-native-styled-toast'

import { Colors, toastTheme } from '../config/theme'
import { addItem } from '../services/restaurant'
import { getToken } from '../utils/getFromStorage'
import Button from './common/Button'
import Input from './common/Input'

interface Props {
  show: boolean
  restId: string
  setShowItemModal: Function
  getAllItems: Function
}

interface RestaurantItem {
  name: string
  price: number
  restId: string
}

const ItemModal: FC<Props> = ({ show, restId, setShowItemModal, getAllItems }: Props) => {
  const [loading, showLoading] = useState(false)
  const { toast } = useToast()
  const [fields, setFields] = useState([
    {
      id: 0,
      title: 'Item name',
      placeHolder: 'Enter iten name',
      value: ''
    },
    {
      id: 1,
      title: 'Item price',
      placeHolder: 'Enter iten price',
      value: ''
    }
  ])

  const handleChange = (index: number, value: string) => {
    const tempFields = [...fields]
    tempFields[index].value = value
    setFields(tempFields)
  }

  const handleRestItem = async () => {
    setShowItemModal(false)
    showLoading(true)
    try {
      const token = await getToken()
      const body: RestaurantItem = {
        name: fields[0].value,
        price: parseInt(fields[1].value),
        restId
      }
      await addItem(body, token as string)
      await getAllItems()
      toast({ message: 'Item Added' })
    } catch (error) {
      console.log(error)
      toast({
        message: 'Error while adding item!',
        ...toastTheme.error
      })
    }
    showLoading(false)
  }

  return (
    <Modal visible={show} transparent={true} style={styles.modelContainer}>
      <TouchableOpacity
        onPress={() => setShowItemModal(false)}
        activeOpacity={1}
        style={styles.backdropModel}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => null} style={styles.itemContainer}>
          <Text style={styles.itemDetailsHeading}>Enter Item Details</Text>
          {fields.map(item => (
            <Input
              width='80%'
              key={item.id.toString()}
              formik={false}
              title={item.title}
              placeHolder={item.placeHolder}
              handleChange={(text: string) => handleChange(item.id, text)}
            />
          ))}
          <View style={styles.itemButtonContainer}>
            <Button
              handleSubmit={handleRestItem}
              ButtonStyle={{ marginTop: RFPercentage(2.5) }}
              name='Add Item'
              width='80%'
              height={RFPercentage(5)}
              backgroundColor={Colors.primary}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    marginBottom: RFPercentage(1)
  },

  itemButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  }
})

export default ItemModal
