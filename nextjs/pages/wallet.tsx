import React, { useEffect, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from '@/components/connect'
import axios from 'axios';

interface AddressData {
  [key: string]: {
    name: string;
  }[];
}

export default function Wallet() {
  const { providers, activeAccount } = useWallet()

  const [eventSource, setEventSource] = useState<Window|null>(null);
  const [eventOrigin, setEventOrigin] = useState<string|null>(null);
  
  if (activeAccount?.address && eventSource && eventOrigin) {
    const fetchWalletAndPostMessage = async () => {
      try {
        const response = await axios.get<AddressData>(
          'https://api.nf.domains/nfd/v2/address',
          {
            params: {
              address: 'EIERIRHY3YZITZZUN3E24LDVJUCH3EGYASE5RRCBSPJSBYOYVQKB36WCAE',
              limit: 1,
            },
          }
        );
        const addressData = response.data;
        let name = null;

        if (addressData) {
          const firstEntry = addressData[Object.keys(addressData)[0]][0];
          if (firstEntry && firstEntry.name) {
            name = firstEntry.name;
          }
        }
        
        const data = {
          address: activeAccount?.address,
          name: name ? name : activeAccount?.address.substring(0, 8)
        }
        
        eventSource.postMessage(JSON.stringify(data), eventOrigin);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchWalletAndPostMessage();
    // https://api.nf.domains/nfd/v2/address?address=EIERIRHY3YZITZZUN3E24LDVJUCH3EGYASE5RRCBSPJSBYOYVQKB36WCAE&limit=1
    // https://api.nf.domains/nfd/v2/address?address=

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
