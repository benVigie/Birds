import { useEffect } from 'react';

const YourComponent = () => {
  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      // Always check the origin of the message
      // if (event.origin !== "https://domainA.com") return;

      // Log the received message
      console.log("Received message:", event.data);

      // Send a message back to the parent window
      (event.source as Window).postMessage("Hello back from Domain Bzz!", event.origin);
    }

    // Receive a message from the parent window
    window.addEventListener("message", receiveMessage, false);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("message", receiveMessage);
  }, []); // Empty array indicates this effect should run once when the component is mounted

  return (
    <div>
      Your content goes here
    </div>
  );
};

export default YourComponent;
