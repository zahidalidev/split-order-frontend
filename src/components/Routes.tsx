import { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RegisterScreen from '../pages/auth/RegisterScreen'
import LoginScreen from '../pages/auth/LoginScreen'
import HomeScreen from '../pages/HomeScreen'
import SelectItems from '../pages/SelectItems'

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
  SelectItems: {
    name: string
  }
}

const RootStack = createNativeStackNavigator<RootStackParams>()

const Routes: FC = () => {
  const allRoutes = [
    {
      name: 'Register',
      component: RegisterScreen
    },
    {
      name: 'Login',
      component: LoginScreen
    },
    {
      name: 'Home',
      component: HomeScreen
    },
    {
      name: 'SelectItems',
      component: SelectItems
    }
  ]

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
        {allRoutes.map((item, index) => (
          <RootStack.Screen
            key={index.toString()}
            name={item.name as keyof RootStackParams}
            component={item.component}
          />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default Routes
