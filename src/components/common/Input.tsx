import { FC } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { FontAwesome } from '@expo/vector-icons'

import { Colors } from '../../config/theme'

type errorsOptions = {
  [key: string]: boolean
}
interface Props {
  id: number
  title: string
  placeHolder: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
  value: string
  name: string
  handleChange: Function
  errors: errorsOptions
}

const Input: FC<Props> = ({
  id,
  title,
  placeHolder,
  icon,
  value,
  name,
  handleChange,
  errors
}: Props) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputMainContainer}>
      <Text style={styles.inputHeading}>{title}</Text>
      <View style={styles.inputWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%' }}
        >
          <TextInput
            name={name}
            onChangeText={handleChange(name)}
            style={styles.input}
            placeholder={placeHolder}
          />
        </KeyboardAvoidingView>
        <FontAwesome
          style={styles.inputIcon}
          name={icon}
          color={Colors.grey}
          size={RFPercentage(2.3)}
        />
      </View>
    </View>
    {errors[name] && <Text style={styles.error}>{errors[name]}</Text>}
  </View>
)

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFPercentage(1)
  },

  inputMainContainer: {
    width: '100%',
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
