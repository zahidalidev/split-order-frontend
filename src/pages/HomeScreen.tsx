import { FC, useState } from 'react'
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

import { homeBars, Token, User } from '../utils/constants'
import Button from '../components/common/Button'

import headerImg from '../../assets/header.jpg'
import { Colors } from '../config/theme'
import Input from '../components/common/Input'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addRestaurant } from '../services/restaurant'
import LoadingModal from '../components/common/LoadingModal'

const Home: FC = () => {
  const [selectedItem, setItem] = useState('')
  const [currentBar, setCurrentBar] = useState('rest')
  const [restName, setRestName] = useState('')
  const [loading, setLoading] = useState(false)
  const items = [{ label: 'label1', value: 1 }]

  const handleRestName = (name: string) => {
    if (name) {
      setRestName(name)
    }
  }

  const handleRestaurant = async () => {
    setLoading(true)
    try {
      if (restName === '') {
        Alert.alert('name is requred')
        return
      }

      const token = await AsyncStorage.getItem(Token)
      await addRestaurant(restName, token || '')
    } catch (error: any) {
      console.log('error: ', error.message)
    }
    setLoading(false)
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
              onPress={() => setCurrentBar(item.name)}
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
            <Picker.Item label='Java' value='java' />
            <Picker.Item label='JavaScript' value='js' />
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
