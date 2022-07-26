import { FC } from 'react'
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Colors } from '../../config/theme'

interface Props {
  name: string
  width?: string | number
  handleSubmit?: () => void
  height?: string | number
  backgroundColor?: string
  fontSize?: number
  ButtonStyle?: object
  disable?: boolean
}

const Button: FC<Props> = ({
  name,
  width,
  handleSubmit,
  height = RFPercentage(5.6),
  backgroundColor = Colors.secondary,
  fontSize = RFPercentage(2.3),
  ButtonStyle,
  disable = false
}: Props) => (
  <TouchableOpacity
    disabled={disable}
    activeOpacity={0.7}
    onPress={handleSubmit}
    style={[
      styles.buttonContainer,
      { width, height, backgroundColor: disable ? Colors.grey : backgroundColor },
      ButtonStyle
    ]}
  >
    <Text style={[styles.buttonName, { fontSize }]}>{name}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 2
  },

  buttonName: {
    color: Colors.white
  }
})

export default Button
