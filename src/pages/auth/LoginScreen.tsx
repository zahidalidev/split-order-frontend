import { FC, useEffect, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { loginValidationSchema } from '../../utils/authValidate'
import LoadingModal from '../../components/common/LoadingModal'
import { getCurrentUser, loginUser } from '../../services/user'
import { loginFields, Token } from '../../utils/constants'

import { Colors } from '../../config/theme'
import logo from '../../../assets/logo.png'
import { RootStackParams } from '../../../App'

interface valuesOb {
  email: string
  password: string
}

type Props = NativeStackScreenProps<RootStackParams, 'Restaurent'>

const Login: FC<Props> = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(false)

  const loginHandle = async (values: valuesOb) => {
    try {
      setLoading(true)
      const { data } = await loginUser(values)
      AsyncStorage.setItem(Token, JSON.stringify(data))
      navigation.navigate('Restaurent', { name: '' })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem(Token)
      const { data } = await getCurrentUser(token as string)
      navigation.navigate('Restaurent', { name: '' })
    } catch (error: any) {
      setLogin(true)
      console.log('Login error: ', error.message)
      navigation.navigate('Login', { name: '' })
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return !login ? (
    <LoadingModal show={true} transparent={true} />
  ) : (
    <View style={styles.container}>
      <LoadingModal show={loading} />
      <StatusBar barStyle='light-content' backgroundColor={Colors.secondary} />
      <View style={styles.topContainer}>
        <Image source={logo} resizeMode='contain' style={styles.logo} />
        <Text style={styles.topContainerHeading}>Split Order</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.formWrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.loginHeading}>Login to your account</Text>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{
                email: '',
                password: ''
              }}
              onSubmit={values => loginHandle(values)}
            >
              {({ handleChange, handleSubmit, errors }) => (
                <>
                  {loginFields.map(item => (
                    <Input
                      key={item.id.toString()}
                      {...item}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  ))}
                  <View style={styles.buttonWrapper}>
                    <Button handleSubmit={handleSubmit} name='Login' width='75%' />
                  </View>
                </>
              )}
            </Formik>
          </ScrollView>
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
    flex: 0.35,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: RFPercentage(12)
  },

  topContainerHeading: {
    fontSize: RFPercentage(3.5),
    fontWeight: '400',
    color: Colors.white,
    marginBottom: RFPercentage(5)
  },

  bottomContainer: {
    flex: 0.65,
    backgroundColor: Colors.white,
    borderTopLeftRadius: RFPercentage(2.5),
    borderTopRightRadius: RFPercentage(2.5),
    marginTop: RFPercentage(-3),
    alignItems: 'center'
  },

  formWrapper: {
    width: '90%',
    marginTop: RFPercentage(3)
  },

  loginHeading: {
    fontSize: RFPercentage(3.3),
    margin: RFPercentage(3),
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.secondary
  },

  buttonWrapper: {
    alignItems: 'center',
    marginTop: RFPercentage(5),
    marginBottom: RFPercentage(2)
  }
})

export default Login
