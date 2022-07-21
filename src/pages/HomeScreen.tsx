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

import { homeBars } from '../utils/constants'
import Button from '../components/common/Button'

import headerImg from '../../assets/header.jpg'
import { Colors, toastTheme } from '../config/theme'
import Input from '../components/common/Input'
import { addRestaurant, getUserRestaurant } from '../services/restaurant'
import LoadingModal from '../components/common/LoadingModal'
import { getToken } from '../utils/getToken'

interface RestItems {
  __v: number
  _id: string
  name: string
  userId: string
}

const Home: FC = () => {
  const [selectedItem, setItem] = useState('')
  const [currentBar, setCurrentBar] = useState('rest')
  const [restName, setRestName] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [restPickItems, setRestPickItems] = useState([{ label: 'label1', value: 1 }])

  const handleRestName = (name: string) => {
    if (name) {
      setRestName(name)
    }
  }

  useEffect(() => {
    allUserRestaurents()
  }, [])

  const allUserRestaurents = async () => {
    try {
      const token = await getToken()
      const { data } = await getUserRestaurant(token || '')
      const allRest = data.map((item: RestItems) => {
        return { label: item.name, value: item._id }
      })
      setRestPickItems(allRest)
    } catch (error) {}
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

  return (
    <View style={styles.mainContainer}>
      <LoadingModal show={loading} />
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
                { backgroundColor: currentBar === item.name ? Colors.primary : Colors.lightGrey }
              ]}
            >
              <Text style={styles.barContent}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentBar === 'rest' ? (
          <View style={styles.restContainer}>
            <Input
              title='Restaurant Name'
              placeHolder='Enter restaurant name'
              handleChange={handleRestName}
            />
            <View style={styles.addResBtn}>
              <Button handleSubmit={handleRestaurant} name='Add Restaurant' />
            </View>
          </View>
        ) : (
          <Picker
            style={styles.pickerStyle}
            mode='dropdown'
            placeholder='Select Restaurant'
            selectedValue={selectedItem}
            onValueChange={(itemValue, itemIndex) => setItem(itemValue)}
          >
            {restPickItems.map(item => (
              <Picker.Item key={item.label} label={item.label} value={item.value} />
            ))}
          </Picker>
        )}
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
  }
})

export default Home
