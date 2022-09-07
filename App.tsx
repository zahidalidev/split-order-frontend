import { FC } from 'react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ToastProvider } from 'react-native-styled-toast'
import 'react-native-gesture-handler'

import { toastTheme } from './src/config/theme'
import Routes from './src/components/routes'

const App: FC = () => (
  <ThemeProvider theme={toastTheme}>
    <ToastProvider maxToasts={3} offset={10}>
      <Routes />
    </ToastProvider>
  </ThemeProvider>
)

export default App
