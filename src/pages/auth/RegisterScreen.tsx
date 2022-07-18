import { FC, useState } from 'react'
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { FontAwesome } from '@expo/vector-icons'

import Input from '../../components/common/Input'
import { Colors } from '../../config/theme'

import logo from '../../../assets/logo.png'
import Button from '../../components/common/Button'

const Register: FC = () => {
  const [fields, setFields] = useState<
    {
      name: string
      placeHolder: string
      icon: React.ComponentProps<typeof FontAwesome>['name']
      value: string
      valid: boolean
    }[]
  >([
    {
      name: 'Full Name',
      placeHolder: 'Enter full name',
      icon: 'user-o',
      value: '',
      valid: true
    },
    {
      name: 'Email Address',
      placeHolder: 'Enter email address',
      icon: 'envelope-o',
      value: '',
      valid: true
    },
    {
      name: 'Contact Number',
      placeHolder: 'Enter mobile number',
      icon: 'phone',
      value: '',
      valid: true
    },
    {
      name: 'Full Address',
      placeHolder: 'Enter home address',
      icon: 'map-marker',
      value: '',
      valid: true
    },
    {
      name: 'Passoword',
      placeHolder: 'Enter strong passoword',
      icon: 'lock',
      value: '',
      valid: true
    },
    {
      name: 'Confirm Passoword',
      placeHolder: 'Enter confirm passoword',
      icon: 'lock',
      value: '',
      valid: true
    }
  ])

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.secondary} />
      <View style={styles.topContainer}>
        <Image source={logo} resizeMode='contain' style={styles.logo} />
        <Text style={styles.topContainerHeading}>Split Order</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.formWrapper}>
          <Text style={styles.registerHeading}>Register your account</Text>
          {fields.map((item, index) => (
            <Input key={index.toString()} {...item} />
          ))}

          <View style={styles.buttonWrapper}>
            <Button name='Register' width='75%' />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },

  topContainer: {
    flex: 0.22,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: RFPercentage(7)
  },

  topContainerHeading: {
    fontSize: RFPercentage(2.7),
    fontWeight: '400',
    color: Colors.white,
    marginBottom: RFPercentage(5),
    marginTop: -RFPercentage(2)
  },

  bottomContainer: {
    flex: 0.78,
    backgroundColor: Colors.white,
    borderTopLeftRadius: RFPercentage(2.5),
    borderTopRightRadius: RFPercentage(2.5),
    marginTop: RFPercentage(-3),
    alignItems: 'center'
  },

  formWrapper: {
    width: '90%',
    marginTop: RFPercentage(2)
  },

  registerHeading: {
    fontSize: RFPercentage(3.3),
    margin: RFPercentage(1),
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.secondary
  },

  buttonWrapper: {
    alignItems: 'center',
    marginTop: RFPercentage(4)
  }
})

export default Register
