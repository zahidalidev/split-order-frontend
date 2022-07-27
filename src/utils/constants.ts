import { FontAwesome } from '@expo/vector-icons'
import { RootStackParams } from '../components/routes'

interface ListProps {
  id: number
  title: string
  placeHolder: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
  name: string
}

export const loginFields: ListProps[] = [
  {
    id: 0,
    title: 'Email Address',
    placeHolder: 'Enter email address',
    icon: 'envelope-o',
    name: 'email'
  },
  {
    id: 1,
    title: 'Passoword',
    placeHolder: 'Enter strong passoword',
    icon: 'lock',
    name: 'password'
  }
]

export const registerFields: ListProps[] = [
  {
    id: 0,
    title: 'Full Name',
    placeHolder: 'Enter full name',
    icon: 'user-o',
    name: 'fullName'
  },
  {
    id: 1,
    title: 'Email Address',
    placeHolder: 'Enter email address',
    icon: 'envelope-o',
    name: 'email'
  },
  {
    id: 2,
    title: 'Contact Number',
    placeHolder: 'Enter mobile number',
    icon: 'phone',
    name: 'number'
  },
  {
    id: 3,
    title: 'Full Address',
    placeHolder: 'Enter home address',
    icon: 'map-marker',
    name: 'address'
  },
  {
    id: 4,
    title: 'Passoword',
    placeHolder: 'Enter strong passoword',
    icon: 'lock',
    name: 'password'
  },
  {
    id: 5,
    title: 'Confirm Passoword',
    placeHolder: 'Enter confirm passoword',
    icon: 'lock',
    name: 'confirmPassword'
  }
]

export const Token = 'token'
export const User = 'user'
export const homeBars = [
  {
    id: 0,
    name: 'item',
    title: 'Restaurant Items'
  },
  {
    id: 1,
    name: 'rest',
    title: 'Add Restaurant'
  }
]

interface AllRoute {
  id: number
  name: keyof RootStackParams
  title: string
  icon: any
}

export const drawerRoutes: AllRoute[] = [
  {
    id: 0,
    name: 'Home',
    title: 'Home',
    icon: 'home'
  },
  {
    id: 1,
    name: 'SelectItems',
    title: 'Select Items',
    icon: 'food-variant'
  },
  {
    id: 3,
    name: 'Order',
    title: 'Order',
    icon: 'food'
  }
]

interface TempOrders {
  itemId: string
  name: string
  price: number
  quantity: number
}
interface UserOrder {
  mainUserId: string
  invitedUsers: [
    {
      userId: string
      userName: string
      userEmail: string
      userCharges: number
      orders: TempOrders[]
    }
  ]
}

export const getDataWithTotalCharges = (data: UserOrder[]) => {
  const tempData = [...data]
  const totalChargesArr: number[] = []
  tempData.forEach(({ invitedUsers }: UserOrder) => {
    invitedUsers.forEach(user => {
      totalChargesArr.push(invitedUserBill(user.orders))
      user.userCharges = invitedUserBill(user.orders)
    })
  })
  return {
    dataWithCharges: tempData,
    totalCharges: totalChargesArr.reduce((acc, curr) => acc + curr, 0)
  }
}

const invitedUserBill = (orders: TempOrders[]) =>
  orders.reduce(
    (acc: number, current: TempOrders) => acc + parseInt(current.price * current.quantity),
    0
  )
