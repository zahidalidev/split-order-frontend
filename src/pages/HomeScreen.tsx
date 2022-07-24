import { FC, useEffect, useState } from 'react'
import {
  Alert,
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
import { MaterialIcons } from '@expo/vector-icons'

import { homeBars } from '../utils/constants'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { addRestaurant, getRestaurantItems, getUserRestaurant } from '../services/restaurant'
import LoadingModal from '../components/common/LoadingModal'
import { getToken } from '../utils/getToken'

import { Colors, toastTheme } from '../config/theme'
import headerImg from '../../assets/header.jpg'
import ItemModal from '../components/itemModal'
import UserSelectModal from '../components/userSelectModal'

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

const Home: FC = () => {
  const [selectedRestId, setRestId] = useState('')
  const [currentBar, setCurrentBar] = useState('rest')
  const [restName, setRestName] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [showItemModal, setShowItemModal] = useState(false)
  const [showSelectUserModal, setShowSelectUserModal] = useState(false)
  const [restPickItems, setRestPickItems] = useState<PickerItems[]>([])
  const [currentRestItems, setCurrentRestItems] = useState<CurrentItems[]>([])

  const handleRestName = (name: string) => {
    if (name) {
      setRestName(name)
    }
  }

  useEffect(() => {
    allUserRestaurents()
  }, [])

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

  const addRestaurantComponent = (
    <View style={styles.restContainer}>
      <Input
        title='Restaurant Name'
        placeHolder='Enter restaurant name'
        handleChange={handleRestName}
        formik={false}
      />
      <View style={styles.addResBtn}>
        <Button handleSubmit={handleRestaurant} name='Add Restaurant' />
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
      {currentRestItems.map(item => (
        <View key={item._id} style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price} PKR</Text>
        </View>
      ))}
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <LoadingModal show={loading} />
      <ItemModal show={showItemModal} setShowItemModal={setShowItemModal} restId={selectedRestId} />
      <UserSelectModal
        show={showSelectUserModal}
        setShowItemModal={setShowSelectUserModal}
        restId={selectedRestId}
      />
      <ImageBackground resizeMode='stretch' style={styles.imgContainer} source={headerImg}>
        <StatusBar backgroundColor='transparent' translucent={true} />
      </ImageBackground>
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
    justifyContent: 'center'
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
    marginTop: RFPercentage(2)
  },

  addResBtn: {
    marginTop: RFPercentage(4)
  },

  restItemsComponent: {
    width: '100%',
    alignItems: 'center'
  },

  itemContainer: {
    width: '90%',
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
  }
})

export default Home
