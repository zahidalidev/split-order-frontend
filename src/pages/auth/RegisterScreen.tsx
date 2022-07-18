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
import { Colors } from '../../config/theme'

import logo from '../../../assets/logo.png'
import Button from '../../components/common/Button'
import { registerValidationSchema } from '../../utils/registerValidate'

interface ListProps {
  id: number
  title: string
  placeHolder: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
  value: string
  name: string
}

const Register: FC = () => {
  const [fields, setFields] = useState<ListProps[]>([
    {
      id: 0,
      title: 'Full Name',
      placeHolder: 'Enter full name',
      icon: 'user-o',
      value: '',
      name: 'fullname'
    },
    {
      id: 1,
      title: 'Email Address',
      placeHolder: 'Enter email address',
      icon: 'envelope-o',
      value: '',
      name: 'email'
    },
    {
      id: 2,
      title: 'Contact Number',
      placeHolder: 'Enter mobile number',
      icon: 'phone',
      value: '',
      name: 'number'
    },
    {
      id: 3,
      title: 'Full Address',
      placeHolder: 'Enter home address',
      icon: 'map-marker',
      value: '',
      name: 'address'
    },
    {
      id: 4,
      title: 'Passoword',
      placeHolder: 'Enter strong passoword',
      icon: 'lock',
      value: '',
      name: 'password'
    },
    {
      id: 5,
      title: 'Confirm Passoword',
      placeHolder: 'Enter confirm passoword',
      icon: 'lock',
      value: '',
      name: 'confirmPassword'
    }
  ])

  // const handleChange = (index: number, value: string) => {
  //   const tempFields = [...fields]
  //   tempFields[index].value = value
  //   setFields(tempFields)
  // }

  const registerUser = async () => {
    // const valid = await registerValidate({
    //   fullname: fields[0].value,
    //   email: fields[1].value,
    //   number: parseInt(fields[2].value),
    //   address: fields[3].value,
    //   password: fields[4].value,
    //   confirmPassword: fields[5].value
    // })
    // console.log('valid: ', valid)
  }

  return (
    <View style={styles.container}>
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
                fullname: '',
                email: '',
                number: '',
                address: '',
                password: '',
                confirmPassword: ''
              }}
              onSubmit={values => console.log(values)}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <>
                  {console.log(errors)}
                  {fields.map(item => (
                    <Input
                      key={item.id.toString()}
                      {...item}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  ))}
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
  }
})

export default Register
