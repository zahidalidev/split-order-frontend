import { FC } from 'react'
import { ThemeProvider } from 'styled-components'
import { ToastProvider } from 'react-native-styled-toast'
import React from 'react'

import { toastTheme } from './src/config/theme'
import Routes from './src/components/Routes'

const App: FC = () => (
  <ThemeProvider theme={toastTheme}>
    <ToastProvider maxToasts={3}>
      <Routes />
    </ToastProvider>
  </ThemeProvider>
)

export default App
