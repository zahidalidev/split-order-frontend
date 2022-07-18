import { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import RegisterScreen from './src/pages/auth/RegisterScreen'

const Stack = createStackNavigator()

const App: FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='register'>
        <Stack.Screen name='register' component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
