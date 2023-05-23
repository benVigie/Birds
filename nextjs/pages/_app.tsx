import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { reconnectProviders, initializeProviders, WalletProvider } from '@txnlab/use-wallet'
import React from 'react'
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

const walletProviders = initializeProviders()


export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    reconnectProviders(walletProviders)
  }, [])
  
  return <WalletProvider value={walletProviders}>
      <CssVarsProvider>
        <CssBaseline />
          <Component {...pageProps} />
    </CssVarsProvider>
  </WalletProvider>
}
