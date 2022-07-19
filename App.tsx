import { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RegisterScreen from './src/pages/auth/RegisterScreen'
import LoginScreen from './src/pages/auth/LoginScreen'
import RestaurentScreen from './src/pages/RestaurentScreen'

export type RootStackParams = {
  Register: {
    name: string
  }
  Login: {
    name: string
  }
  Restaurent: {
    name: string
  }
}

const RootStack = createNativeStackNavigator<RootStackParams>()

const App: FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
        <RootStack.Screen name='Register' component={RegisterScreen} />
        <RootStack.Screen name='Login' component={LoginScreen} />
        <RootStack.Screen name='Restaurent' component={RestaurentScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default App
