import React, { useState, useEffect } from "react";

function MetaMaskButton(props) {
  const [buttonState, setButtonState] = useState({ label: "Connect MetaMask" });

  useEffect(() => {
    setButtonState({ label: props.account });
  }, [props.account]);
  
  return (
    <p className="control">
      <button className="button is-primary" onClick={
        async () => {
          // MetaMask API
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          if (accounts.length !== 0) {
            setButtonState({
              label: accounts[0]
            });
          }
        }
      }>
        {buttonState.label}
      </button>
    </p>
  )
}

export default MetaMaskButton;