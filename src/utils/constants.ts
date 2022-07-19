import { FontAwesome } from '@expo/vector-icons'

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
    title: 'Add Items'
  },
  {
    id: 1,
    name: 'rest',
    title: 'Add Restaurant'
  }
]
