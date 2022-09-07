import { FC } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { FontAwesome } from '@expo/vector-icons'

import { Colors } from '../../config/theme'

interface ErrorsOptions {
  [key: string]: {}
}

interface Props {
  title: string
  placeHolder: string
  icon?: React.ComponentProps<typeof FontAwesome>['name']
  name?: string
  handleChange: Function
  errors?: ErrorsOptions
  width?: string | number
  formik?: boolean
}

const Input: FC<Props> = ({
  title,
  placeHolder,
  icon,
  name = '',
  handleChange,
  errors,
  width = '100%',
  formik = true
}: Props) => {
  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputMainContainer, { width }]}>
        <Text style={styles.inputHeading}>{title}</Text>
        <View style={styles.inputWrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, width: '100%' }}
          >
            {formik ? (
              <TextInput
                onChangeText={handleChange(name)}
                name={name}
                style={[styles.input, { marginTop: 7, marginBottom: 7 }]}
                placeholder={placeHolder}
              />
            ) : (
              <TextInput
                onChangeText={text => handleChange(text)}
                style={[styles.input, { marginTop: 7, marginBottom: 7 }]}
                placeholder={placeHolder}
              />
            )}
          </KeyboardAvoidingView>
          {icon && (
            <FontAwesome
              style={styles.inputIcon}
              name={icon}
              color={Colors.grey}
              size={RFPercentage(2.3)}
            />
          )}
        </View>
      </View>
      {errors && errors[name] && <Text style={styles.error}>{errors[name]}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFPercentage(1)
  },

  inputMainContainer: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.grey,
    marginTop: RFPercentage(2)
  },

  inputHeading: {
    fontWeight: '500',
    color: Colors.secondary
  },

  inputWrapper: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  inputIcon: {
    margin: 10
  },

  input: {
    fontSize: RFPercentage(2.2)
  },

  error: {
    color: Colors.danger,
    alignSelf: 'flex-start'
  }
})

export default Input
