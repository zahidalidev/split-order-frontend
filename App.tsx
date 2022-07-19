import { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RegisterScreen from './src/pages/auth/RegisterScreen'
import LoginScreen from './src/pages/auth/LoginScreen'
import HomeScreen from './src/pages/HomeScreen'

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

const App: FC = () => (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
      <RootStack.Screen name='Register' component={RegisterScreen} />
      <RootStack.Screen name='Login' component={LoginScreen} />
      <RootStack.Screen name='Home' component={HomeScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
)

export default App
