import { FC } from 'react'
import { Subscription } from 'expo-modules-core'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ThemeProvider } from 'styled-components'
import { ToastProvider } from 'react-native-styled-toast'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native'

import RegisterScreen from './src/pages/auth/RegisterScreen'
import LoginScreen from './src/pages/auth/LoginScreen'
import HomeScreen from './src/pages/HomeScreen'
import { toastTheme } from './src/config/theme'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export type RootStackParams = {
  Register: {
    name: string
  }
  Login: {
    name: string
  }
  Home: {
    name: string
  }
}

const RootStack = createNativeStackNavigator<RootStackParams>()

const App: FC = () => {
  const [notification, setNotification] = useState<Notifications.Notification>()
  const notificationListener: React.MutableRefObject<object> = useRef({})
  const responseListener: React.MutableRefObject<object> = useRef({})

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('notification app: ', notification)
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('response app: ', response.notification.request.content.data)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <ThemeProvider theme={toastTheme}>
      <ToastProvider maxToasts={3}>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
            <RootStack.Screen name='Register' component={RegisterScreen} />
            <RootStack.Screen name='Login' component={LoginScreen} />
            <RootStack.Screen name='Home' component={HomeScreen} />
          </RootStack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </ThemeProvider>
  )
}

async function registerForPushNotificationsAsync() {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return token
}

export default App
