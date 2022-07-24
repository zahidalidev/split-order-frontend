import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { useToast } from 'react-native-styled-toast'
import CheckBox from 'expo-checkbox'

import { Colors, toastTheme } from '../config/theme'
import { addItem } from '../services/restaurant'
import { getAllUsers } from '../services/user'
import { getToken } from '../utils/getToken'
import Button from './common/Button'
import Input from './common/Input'

interface SelectedUser {
  userId: string
}
interface Props {
  show: boolean
  restId: string
  setShowItemModal: Function
  selectUsers: Dispatch<SetStateAction<SelectedUser[]>>
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

const UserSelectModal: FC<Props> = ({ show, restId, setShowItemModal, selectUsers }: Props) => {
  const [loading, showLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()

  useEffect(() => {
    handleAllUsers()
  }, [])

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

  const handleSelectedUsers = async () => {
    setShowItemModal(false)
    const tempUsers: SelectedUser[] = []
    users.forEach(item => {
      if (item.selected) {
        tempUsers.push({ userId: item._id })
      }
    })
    selectUsers(tempUsers)
  }

  return (
    <Modal visible={show} transparent={true} style={styles.modelContainer}>
      <View style={styles.backdropModel}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemDetailsHeading}>Select users to add</Text>
          <ScrollView style={styles.userContainerScroll}>
            <View style={styles.userContainer}>
              {users.map((item, index) => (
                <View key={item._id} style={styles.userCheckContaienr}>
                  <Text style={styles.userName}>{item.fullName}</Text>
                  <Text numberOfLines={1} style={styles.userEmail}>
                    {item.email}
                  </Text>
                  <CheckBox
                    style={styles.checkbox}
                    value={item.selected}
                    onValueChange={newValue => handleUserSelect(index, newValue)}
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
            handleSubmit={handleSelectedUsers}
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

  userContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  userCheckContaienr: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: RFPercentage(1.7)
  },

  userName: {
    fontSize: RFPercentage(2.1),
    textAlign: 'left',
    width: '20%'
  },

  userEmail: {
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

export default UserSelectModal
