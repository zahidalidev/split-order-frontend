import { FC, useEffect, useState, useRef } from 'react'
import {
  Alert,
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Picker } from '@react-native-picker/picker'
import { useToast } from 'react-native-styled-toast'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Badge } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import * as Notifications from 'expo-notifications'

import { homeBars, Token, User } from '../utils/constants'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { addRestaurant, getRestaurantItems, getUserRestaurant } from '../services/restaurant'
import LoadingModal from '../components/common/LoadingModal'
import { getStoreUser, getToken } from '../utils/getFromStorage'
import ItemModal from '../components/itemModal'
import UserSelectModal from '../components/userSelectModal'
import { RootStackParams } from '../components/routes'
import { SentNotification } from '../utils/SendNotification'

import { Colors, toastTheme } from '../config/theme'
import headerImg from '../../assets/header.jpg'
import { DrawerActions } from '@react-navigation/native'

interface RestItems {
  __v: number
  _id: string
  name: string
  userId: string
}
interface PickerItems {
  label: string
  value: string
}
interface CurrentItems {
  __v: number
  _id: string
  name: string
  price: number
  restId: string
}

interface SelectedUser {
  pushToken: string
}

interface NotificationData {
  from_id: string
  rest_id: string
  url: string
}
interface PushNotification {
  to: string
  sound: string
  body: string
  data: NotificationData
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

type Props = NativeStackScreenProps<RootStackParams, 'Login'>

const Home: FC<Props> = (props: Props) => {
  const [selectedRestId, setRestId] = useState('')
  const [currentBar, setCurrentBar] = useState('rest')
  const [restName, setRestName] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [showItemModal, setShowItemModal] = useState(false)
  const [showSelectUserModal, setShowSelectUserModal] = useState(false)
  const [restPickItems, setRestPickItems] = useState<PickerItems[]>([])
  const [currentRestItems, setCurrentRestItems] = useState<CurrentItems[]>([])
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([])

  const [notification, setNotification] = useState<Notifications.Notification>()
  const notificationListener: React.MutableRefObject<object> = useRef({})
  const responseListener: React.MutableRefObject<object> = useRef({})

  useEffect(() => {
    allUserRestaurents()
    listenPushNotification()
  }, [])

  const listenPushNotification = () => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { from_id, rest_id } = response.notification.request.content.data

      if (from_id) {
        props.navigation.navigate('SelectItems', { from_id, rest_id })
      }
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }

  const handleRestName = (name: string) => {
    if (name) {
      setRestName(name)
    }
  }

  const getAllItems = async (restId: string) => {
    try {
      const token = await getToken()
      const { data } = await getRestaurantItems(restId, token || '')
      setCurrentRestItems(data)
    } catch (error) {
      toast({
        message: 'Error while getting items!',
        ...toastTheme.error
      })
    }
  }

  const allUserRestaurents = async () => {
    try {
      const token = await getToken()
      const { data } = await getUserRestaurant(token || '')
      const allRest = data.map((item: RestItems) => {
        return { label: item.name, value: item._id }
      })
      setRestPickItems(allRest)
      const restId = allRest[0].value
      setRestId(restId)
      getAllItems(restId)
    } catch (error) {
      toast({
        message: 'Error while getting restaurant!',
        ...toastTheme.error
      })
    }
  }

  const handleRestaurant = async () => {
    setLoading(true)
    try {
      if (restName === '') {
        Alert.alert('name is requred')
        return
      }

      const token = await getToken()
      await addRestaurant(restName, token || '')
      toast({ message: 'Restaurant Added' })
    } catch (error: any) {
      console.log('error: ', error.message)
      toast({
        message: 'Error while adding restaurant!',
        ...toastTheme.error
      })
    }
    setLoading(false)
  }

  const handleCurrentBar = (name: string) => {
    setCurrentBar(name)
    if (name === 'item') {
      allUserRestaurents()
    }
  }

  const handleInviteUsers = async () => {
    if (selectedUsers.length === 0) {
      return toast({ message: 'Please select atleast 1 user', ...toastTheme.error })
    }
    try {
      const arr: PushNotification[] = []
      const currentUser = await getStoreUser()
      selectedUsers.forEach(item => {
        if (item.pushToken) {
          arr.push({
            to: item.pushToken,
            sound: 'default',
            body: `You recieved an invitation from ${currentUser.fullName}`,
            data: { from_id: currentUser._id, rest_id: selectedRestId, url: 'SelectItems' }
          })
        }
      })
      await SentNotification(arr)
      toast({ message: 'Notification sent!' })
    } catch (error) {
      toast({ message: 'Error in sending notification!', ...toastTheme.colors })
    }
  }

  const handleDrawer = () => {
    props.navigation.dispatch(DrawerActions.toggleDrawer())
  }

  const addRestaurantComponent = (
    <View style={styles.restContainer}>
      <Input
        title='Restaurant Name'
        placeHolder='Enter restaurant name'
        handleChange={handleRestName}
        formik={false}
      />
      <View style={styles.addResBtn}>
        <Button
          handleSubmit={handleRestaurant}
          backgroundColor={Colors.primary}
          width='60%'
          name='Add Restaurant'
        />
      </View>
    </View>
  )

  const restaurantItemsComponent = (
    <View style={styles.restItemsComponent}>
      <Picker
        style={styles.pickerStyle}
        mode='dropdown'
        placeholder='Select Restaurant'
        selectedValue={selectedRestId}
        onValueChange={(itemValue, itemIndex) => setRestId(itemValue)}
      >
        {restPickItems.map(item => (
          <Picker.Item key={item.label} label={item.label} value={item.value} />
        ))}
      </Picker>
      <View style={styles.restHeadingWrap}>
        <Text style={styles.restHeading}>Restaurant Items</Text>
        <View style={styles.headingIconContainer}>
          <TouchableOpacity
            onPress={() => setShowSelectUserModal(true)}
            activeOpacity={0.7}
            style={[styles.itemAddIcon, styles.addUserIcon]}
          >
            <Badge
              size={18}
              style={{ position: 'absolute', top: -10, right: -5, backgroundColor: Colors.primary }}
            >
              {selectedUsers.length}
            </Badge>
            <MaterialIcons name='person-add-alt' color={Colors.primary} size={RFPercentage(3)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowItemModal(true)}
            activeOpacity={0.7}
            style={styles.itemAddIcon}
          >
            <MaterialIcons name='post-add' color={Colors.primary} size={RFPercentage(3)} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={styles.itemScrollContaier}
        data={currentRestItems}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View key={item._id} style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price} PKR</Text>
          </View>
        )}
      />
      <Button
        name='Invite Users'
        backgroundColor={Colors.primary}
        width='60%'
        ButtonStyle={styles.inviteBtn}
        handleSubmit={handleInviteUsers}
      />
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <ImageBackground resizeMode='stretch' style={styles.imgContainer} source={headerImg}>
        <StatusBar backgroundColor='transparent' translucent={true} />
      </ImageBackground>
      <TouchableOpacity onPress={handleDrawer} style={styles.menuIcon}>
        <MaterialCommunityIcons name='menu' size={RFPercentage(3)} color={Colors.white} />
      </TouchableOpacity>
      <LoadingModal show={loading} />
      <ItemModal show={showItemModal} setShowItemModal={setShowItemModal} restId={selectedRestId} />
      <UserSelectModal
        show={showSelectUserModal}
        setShowItemModal={setShowSelectUserModal}
        restId={selectedRestId}
        selectUsers={setSelectedUsers}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.barsWrapper}>
          {homeBars.map(item => (
            <TouchableOpacity
              key={item.id.toString()}
              activeOpacity={0.7}
              onPress={() => handleCurrentBar(item.name)}
              style={[
                styles.bar,
                {
                  backgroundColor: currentBar === item.name ? Colors.primary : Colors.lightGrey
                }
              ]}
            >
              <Text style={styles.barContent}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentBar === 'rest' ? addRestaurantComponent : restaurantItemsComponent}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },

  imgContainer: {
    flex: 0.3
  },

  bottomContainer: {
    flex: 0.7,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    marginTop: -RFPercentage(2),
    backgroundColor: Colors.white,
    alignItems: 'center'
  },

  pickerStyle: {
    width: '90%',
    padding: 5,
    elevation: 2,
    backgroundColor: Colors.white,
    margin: 10,
    justifyContent: 'center',
    marginTop: RFPercentage(3)
  },

  barsWrapper: {
    width: '90%',
    flexDirection: 'row',
    borderWidth: 0.5,
    elevation: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 5,
    marginTop: RFPercentage(2)
  },

  bar: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFPercentage(1.5)
  },

  barContent: {
    fontSize: RFPercentage(2.2),
    color: Colors.white,
    fontWeight: '600'
  },

  restContainer: {
    width: '90%',
    marginTop: RFPercentage(2),
    flex: 1
  },

  addResBtn: {
    alignItems: 'center',
    position: 'absolute',
    bottom: RFPercentage(4),
    left: 0,
    right: 0
  },

  restItemsComponent: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },

  itemScrollContaier: {
    width: '90%',
    marginBottom: RFPercentage(15)
  },

  inviteBtn: {
    position: 'absolute',
    bottom: RFPercentage(4)
  },

  itemContainer: {
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: RFPercentage(2)
  },

  restHeadingWrap: {
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    width: '90%',
    paddingBottom: 10,
    borderBottomColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: RFPercentage(2)
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

  itemName: {
    fontSize: RFPercentage(2.2),
    fontWeight: '500'
  },

  itemPrice: {
    fontSize: RFPercentage(2),
    marginLeft: RFPercentage(3)
  },

  itemAddIcon: {
    backgroundColor: Colors.lightGrey2,
    padding: 4,
    borderRadius: 5,
    elevation: 3
  },

  addUserIcon: {
    marginRight: RFPercentage(2)
  },

  headingIconContainer: {
    flexDirection: 'row'
  },

  menuIcon: { position: 'absolute', left: RFPercentage(2), top: RFPercentage(5.5) }
})

export default Home
