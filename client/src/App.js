import React, { useState, useEffect } from "react";
import Web3 from "web3";
import * as IPFS from "ipfs-core";
import Error from "./Error";
import MetaMaskButton from "./MetaMaskButton";
import Nav from "./Nav";
import NewListing from "./NewListing";

function App() {
  const [error, setError] = useState({ message: null });

  const [web3APIs, setWeb3APIs] = useState({
    provider: null,
    web3: null,
    ipfs: null
  });

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;
      let ipfs = await IPFS.create();
  
      if (window.ethereum) {
        // new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws")
        provider = window.ethereum;
      } else if (window.web3) {
        // legacy API
        provider = window.web3.currentProvider;
      } else {
        window.alert("Install MetaMask to proceed!")
      }
  
      setWeb3APIs({
        provider: provider,
        web3: new Web3(provider),
        ipfs: ipfs
      });
    }

    loadProvider();
  }, []);

  useEffect(() => {
    const loadAccounts = async () => {
      try {  
        // const accounts = await web3APIs.web3.eth.getAccounts();    
        const accounts = await web3APIs.provider.request({ method: "eth_requestAccounts" });
        if (accounts.length !== 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error(`Unable to access the accounts: ${err}`);
        
        setError({ message: err.message });
        const timer = setTimeout(() => setError({ message: null }), 5000);

        // return () => clearTimeout(timer);
      }
    }

    web3APIs.provider && loadAccounts();
  }, [web3APIs.provider]);

  return (
    <>
      <div className="container">
        <header>
          <Error message={error.message}></Error>
          
          <Nav>
            <MetaMaskButton account={account}></MetaMaskButton>
          </Nav>
        </header>

        <section className="section">
          <h1 className="title">Create Listing</h1>
          <h2 className="subtitle">A simple container to divide your page into sections.</h2>
          <NewListing></NewListing>
        </section>
        
        <footer className="footer">Copyright 2022</footer>
      </div>
    </>
  );
}

export default App;
