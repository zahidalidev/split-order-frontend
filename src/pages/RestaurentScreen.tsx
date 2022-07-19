import { FC, useState } from 'react'
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Picker } from '@react-native-picker/picker'

import headerImg from '../../assets/header.jpg'
import { Colors } from '../config/theme'

const Restaurent: FC = () => {
  const [selectedItem, setItem] = useState('')

  const items = [
    { label: 'label1', value: 1 },
    { label: 'label2', value: 2 },
    { label: 'label3', value: 3 },
    { label: 'label4', value: 4 },
    { label: 'label5', value: 5 },
    { label: 'label6', value: 6 },
    { label: 'label7', value: 7 },
    { label: 'label8', value: 8 },
    { label: 'label9', value: 9 }
  ]

  return (
    <View style={styles.mainContainer}>
      <ImageBackground resizeMode='stretch' style={styles.imgContainer} source={headerImg}>
        <StatusBar backgroundColor='transparent' translucent={true} />
      </ImageBackground>
      <View style={styles.bottomContainer}>
        <Picker
          selectedValue={selectedItem}
          onValueChange={(itemValue, itemIndex) => setItem(itemValue)}
        >
          <Picker.Item label='Java' value='java' />
          <Picker.Item label='JavaScript' value='js' />
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },

  imgContainer: {
    flex: 0.3
  },

  bottomContainer: {
    flex: 0.7,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    marginTop: -RFPercentage(2),
    backgroundColor: Colors.white
  }
})

export default Restaurent
