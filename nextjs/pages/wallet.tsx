import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from '@/components/connect'

export default function Wallet() {
  const { providers, activeAccount } = useWallet()

  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  return (
    <Connect />
  )

}
