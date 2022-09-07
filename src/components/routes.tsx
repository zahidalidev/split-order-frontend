import { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import RegisterScreen from '../pages/auth/RegisterScreen'
import LoginScreen from '../pages/auth/LoginScreen'
import HomeScreen from '../pages/HomeScreen'
import SelectItems from '../pages/SelectItems'
import Drawer from './drawer'
import Order from '../pages/OrderScreen'

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
  Order: {
    name: string
  }
}

const RootStack = createDrawerNavigator<RootStackParams>()

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
    },
    {
      name: 'Order',
      component: Order
    }
  ]

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        drawerContent={(props: any) => <Drawer {...props} />}
        initialRouteName='Login'
      >
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
