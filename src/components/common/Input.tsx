import { FC } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { FontAwesome } from '@expo/vector-icons'

import { Colors } from '../../config/theme'

interface Props {
  name: string
  placeHolder: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
  value: string
  valid: boolean
}

const Input: FC<Props> = (props: Props) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputMainContainer}>
      <Text style={styles.inputHeading}>{props.name}</Text>
      <View style={styles.inputWrapper}>
        <TextInput style={styles.input} placeholder={props.placeHolder} />
        <FontAwesome
          style={styles.inputIcon}
          name={props.icon}
          color={Colors.grey}
          size={RFPercentage(2.3)}
        />
      </View>
    </View>
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
  }
})

export default Input
