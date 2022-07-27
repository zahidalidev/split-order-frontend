import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { useToast } from 'react-native-styled-toast'
import CheckBox from 'expo-checkbox'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Colors, toastTheme } from '../config/theme'
import { getAllUsers } from '../services/user'
import { getToken } from '../utils/getFromStorage'
import Button from './common/Button'
import LoadingModal from './common/LoadingModal'

interface SelectedUser {
  pushToken: string
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
  pushToken: string
}

const UserSelectModal: FC<Props> = ({ show, restId, setShowItemModal, selectUsers }: Props) => {
  const [loading, showLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [refreshing, setRefreshing] = React.useState(false)
  const { toast } = useToast()

  useEffect(() => {
    handleAllUsers()
  }, [])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    showLoading(true)
    await handleAllUsers()
    setRefreshing(false)
    showLoading(false)
  }, [])

  const handleAllUsers = async () => {
    try {
      showLoading(true)
      const token = await getToken()
      const { data } = await getAllUsers(token as string)
      setUsers(data)
    } catch (error) {
      toast({ message: 'Gettting users error!', ...toastTheme.error })
    }
    showLoading(false)
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
      if (item.selected && item.pushToken) {
        tempUsers.push({
          pushToken: item.pushToken
        })
      }
    })
    if (tempUsers.length === 0) {
      toast({
        message: 'User not selected or selected user should login atleast once',
        ...toastTheme.error
      })
    }
    selectUsers(tempUsers)
  }

  return (
    <Modal visible={show} transparent={true} style={styles.modelContainer}>
      <LoadingModal show={loading} />
      <View style={styles.backdropModel}>
        <View style={styles.itemContainer}>
          <TouchableOpacity onPress={() => setShowItemModal(false)} style={styles.modelCross}>
            <MaterialCommunityIcons name='close' color={Colors.primary} size={RFPercentage(3.5)} />
          </TouchableOpacity>
          <Text style={styles.itemDetailsHeading}>Select users to add</Text>
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={styles.userContainerScroll}
          >
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
    alignItems: 'center',
    marginBottom: RFPercentage(2)
  },

  userCheckContaienr: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: RFPercentage(2)
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
  },

  modelCross: {
    position: 'absolute',
    right: RFPercentage(2),
    top: RFPercentage(1)
  }
})

export default UserSelectModal
