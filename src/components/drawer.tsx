import { FC, useEffect } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RFPercentage } from 'react-native-responsive-fontsize'
import Constants from 'expo-constants'
import { useToast } from 'react-native-styled-toast'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

import { drawerRoutes, Token, User } from '../utils/constants'
import { RootStackParams } from './routes'
import { toastTheme } from '../config/theme'

type Props = NativeStackScreenProps<RootStackParams, 'Home'>

const Drawer: FC<Props> = (props: Props) => {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(Token)
      await AsyncStorage.removeItem(User)
      props.navigation.navigate('Login', { name: '' })
    } catch (error) {
      toast({ message: 'Logout Error!', ...toastTheme.error })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.routeBtnWrapper}>
        <FlatList
          data={drawerRoutes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => props.navigation.navigate(item.name, { name: '' })}
              activeOpacity={0.7}
              style={styles.routeBtn}
            >
              <MaterialCommunityIcons name={item.icon} size={RFPercentage(3)} />
              <Text style={styles.routeName}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={[styles.routeBtnWrapper, styles.logout]}>
        <TouchableOpacity style={styles.routeBtn} activeOpacity={0.7} onPress={handleLogout}>
          <AntDesign name='logout' size={RFPercentage(3)} />
          <Text style={styles.routeName}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },

  routeBtnWrapper: {
    width: '100%',
    justifyContent: 'center',
    marginTop: RFPercentage(3)
  },

  routeBtn: {
    margin: RFPercentage(2),
    flexDirection: 'row',
    alignItems: 'center'
  },

  routeName: {
    fontSize: RFPercentage(2.5),
    fontWeight: '400',
    marginLeft: RFPercentage(3)
  },

  logout: {
    position: 'absolute',
    bottom: RFPercentage(2)
  }
})

export default Drawer
