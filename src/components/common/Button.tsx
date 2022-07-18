import { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Colors } from '../../config/theme'

interface Props {
  name: string
  width: string
}

const Button: FC<Props> = (props: Props) => (
  <TouchableOpacity activeOpacity={0.7} style={[styles.buttonContainer, { width: props.width }]}>
    <Text style={styles.buttonName}>{props.name}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.secondary,
    height: RFPercentage(5.6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 2
  },

  buttonName: {
    color: Colors.white,
    fontSize: RFPercentage(2.3)
  }
})

export default Button
