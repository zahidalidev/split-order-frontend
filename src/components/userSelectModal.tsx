import React, { FC, useEffect, useState } from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { useToast } from 'react-native-styled-toast'
import CheckBox from 'expo-checkbox'

import { Colors, toastTheme } from '../config/theme'
import { addItem } from '../services/restaurant'
import { getAllUsers } from '../services/user'
import { getToken } from '../utils/getToken'
import Button from './common/Button'
import Input from './common/Input'

interface Props {
  show: boolean
  restId: string
  setShowItemModal: Function
}

interface User {
  __v: number
  _id: string
  address: string
  email: string
  fullName: string
  number: number
  selected: boolean
}

const UserSelectModal: FC<Props> = ({ show, restId, setShowItemModal }: Props) => {
  const [loading, showLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()

  const handleAllUsers = async () => {
    try {
      const token = await getToken()
      const { data } = await getAllUsers(token as string)
      setUsers(data)
    } catch (error) {
      toast({ message: 'Gettting users error!', ...toastTheme.error })
    }
  }

  const handleUserSelect = (index: number, value: boolean) => {
    const tempUsers = [...users]
    tempUsers[index].selected = value
    setUsers(tempUsers)
  }

  useEffect(() => {
    handleAllUsers()
  }, [])

  return (
    <Modal visible={show} transparent={true} style={styles.modelContainer}>
      <TouchableOpacity
        onPress={() => setShowItemModal(false)}
        activeOpacity={1}
        style={styles.backdropModel}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => null} style={styles.itemContainer}>
          <Text style={styles.itemDetailsHeading}>Select users to add</Text>
          <View style={styles.userContainer}>
            {users.map((item, index) => (
              <View key={item._id} style={styles.userCheckContaienr}>
                <Text style={styles.userName}>{item.fullName}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <CheckBox
                  style={styles.checkbox}
                  value={item.selected}
                  onValueChange={newValue => handleUserSelect(index, newValue)}
                  color={item.selected ? Colors.primary : undefined}
                />
              </View>
            ))}
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
    marginBottom: RFPercentage(1),
    borderBottomWidth: 2,
    width: '90%',
    textAlign: 'center',
    borderBottomColor: Colors.lightGrey2,
    paddingBottom: 7
  },

  userContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  userCheckContaienr: {
    flexDirection: 'row',
    width: '90%'
  },

  userName: {
    fontSize: RFPercentage(2.1)
  },

  userEmail: {
    fontSize: RFPercentage(2.1),
    marginLeft: 10
  },

  checkbox: {
    width: RFPercentage(2.1),
    height: RFPercentage(2.1)
  }
})

export default UserSelectModal
