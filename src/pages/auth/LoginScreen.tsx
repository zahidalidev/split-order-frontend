import { FC, useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useToast } from 'react-native-styled-toast'

import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { loginValidationSchema } from '../../utils/authValidate'
import LoadingModal from '../../components/common/LoadingModal'
import { getCurrentUser, loginUser } from '../../services/user'
import { loginFields, Token, User } from '../../utils/constants'
import { RootStackParams } from '../../components/routes'
import { getPushNotificationsToken } from '../../components/common/Notification'

import { Colors, toastTheme } from '../../config/theme'
import logo from '../../../assets/logo.png'

interface valuesOb {
  email: string
  password: string
}

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const Login: FC<Props> = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(false)
  const { toast } = useToast()

  const loginHandle = async (values: valuesOb) => {
    try {
      setLoading(true)
      const pushToken = await getPushNotificationsToken()
      const tempValues = { ...values, pushToken }
      const { data } = await loginUser(tempValues)
      AsyncStorage.setItem(Token, JSON.stringify(data))
      await getUser()
      toast({
        message: 'Login Successful!'
      })
      navigation.navigate('Home', { name: '' })
    } catch (error: any) {
      toast({
        message: error,
        ...toastTheme.error
      })
    }
    setLoading(false)
  }

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem(Token)
      const { data } = await getCurrentUser(token as string)
      await AsyncStorage.setItem(User, JSON.stringify(data))
      navigation.navigate('Home', { name: '' })
    } catch (error: any) {
      console.log('Login error: ', error.message)
    }
    setLogin(true)
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

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Register', { name: '' })}
                    style={styles.account}
                  >
                    <Text style={styles.accountDescLogin}>Create Account</Text>
                    <Text style={styles.accountDesc}>Don't have an account? </Text>
                  </TouchableOpacity>
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
  },

  account: {
    flexDirection: 'row-reverse',
    marginTop: RFPercentage(1.5)
  },

  accountDesc: {
    fontSize: RFPercentage(1.8)
  },

  accountDescLogin: {
    color: Colors.primary,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    marginLeft: 2
  }
})

export default Login
