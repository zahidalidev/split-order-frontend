import { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const SelectItems: FC = () => {
  return (
    <View style={styles.container}>
      <Text>response.notification.request.content.data.from_id</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default SelectItems
