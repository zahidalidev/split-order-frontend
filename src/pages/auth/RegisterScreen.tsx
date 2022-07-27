import { FC, Ref, useRef, useState } from 'react'
import {
  FlatList,
  GestureResponderEvent,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { FontAwesome } from '@expo/vector-icons'
import { Formik } from 'formik'

import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { registerValidationSchema } from '../../utils/authValidate'
import { addUser } from '../../services/user'
import LoadingModal from '../../components/common/LoadingModal'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { Colors } from '../../config/theme'
import logo from '../../../assets/logo.png'
import { RootStackParams } from '../../components/routes'
import { registerFields } from '../../utils/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = NativeStackScreenProps<RootStackParams, 'Login'>

interface ValuesOb {
  fullName: string
  email: string
  number: string
  address: string
  password: string
  confirmPassword: string
}

const Register: FC<Props> = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false)

  const registerUser = async (values: ValuesOb) => {
    try {
      setLoading(true)
      const { data } = await addUser(values)
      console.log(data)
      navigation.navigate('Login', { name: '' })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
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
            <Text style={styles.registerHeading}>Register your account</Text>
            <Formik
              validationSchema={registerValidationSchema}
              initialValues={{
                fullName: '',
                email: '',
                number: '',
                address: '',
                password: '',
                confirmPassword: ''
              }}
              onSubmit={values => registerUser(values)}
            >
              {({ handleChange, handleSubmit, errors }) => (
                <>
                  {registerFields.map(item => (
                    <Input
                      key={item.id.toString()}
                      {...item}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  ))}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Login', { name: '' })}
                    style={styles.account}
                  >
                    <Text style={styles.accountDescLogin}>login</Text>
                    <Text style={styles.accountDesc}>Already have an account? </Text>
                  </TouchableOpacity>
                  <View style={styles.buttonWrapper}>
                    <Button handleSubmit={handleSubmit} name='Register' width='75%' />
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
    marginTop: RFPercentage(4),
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

export default Register
