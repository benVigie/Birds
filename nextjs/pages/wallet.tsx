import React, { useEffect, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from '@/components/connect'

export default function Wallet() {
  const { providers, activeAccount } = useWallet()

  const [eventSource, setEventSource] = useState<Window|null>(null);
  const [eventOrigin, setEventOrigin] = useState<string|null>(null);
  
  if (activeAccount?.address && eventSource && eventOrigin) {
    const data = {
      address: activeAccount?.address,
      name: activeAccount?.address.substring(0, 8)
    }
    eventSource.postMessage(JSON.stringify(data), eventOrigin);
  }

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      // Always check the origin of the message
      // if (event.origin !== "https://domainA.com") return;

      // Log the received message
      console.log("Received message:", event.data);

      setEventSource(event.source as Window);
      setEventOrigin(event.origin);
      // Send a message back to the parent window
    }

    // Receive a message from the parent window
    window.addEventListener("message", receiveMessage, false);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("message", receiveMessage);
  }, []); // Empty array indicates this effect should run once when the component is mounted

  
  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  return (
    <Connect />
  )

}
