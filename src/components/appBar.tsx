import * as React from 'react'
import { Appbar } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { FC } from 'react'
import Constants from 'expo-constants'

import { Colors } from '../config/theme'

interface Props {
  navigation: any
  title: string
}

const AppBar: FC<Props> = ({ navigation, title }: Props) => (
  <Appbar style={styles.bottom}>
    <Appbar.Action icon='chevron-left' onPress={() => navigation.navigate('Home')} />
    <View style={styles.barContentContainer}>
      <Appbar.Content title={title} style={styles.barHeading} />
    </View>
  </Appbar>
)

export default AppBar

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: Colors.primary
  },

  barContentContainer: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    height: Constants.statusBarHeight
  },

  barHeading: {
    marginTop: 5
  }
})
