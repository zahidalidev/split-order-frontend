import { FC } from 'react'
import { ThemeProvider } from 'styled-components'
import { ToastProvider } from 'react-native-styled-toast'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect, useRef } from 'react'

import { toastTheme } from './src/config/theme'
import Routes from './src/components/Routes'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

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
        <Routes />
      </ToastProvider>
    </ThemeProvider>
  )
}
export default App
