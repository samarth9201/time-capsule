import React from 'react'
import clsx from 'clsx'
import Web3 from 'web3'
import connectToWallet from './loadWeb3'
import HomePage from './HomePage'
import logo from "./portland_state_university.svg"

const Factory = require('./contracts/Factory.json')

declare global {
  interface Window {
    ethereum: any,
    web3: Web3
  }
}

const App = () => {

  const [address, setAddress] = React.useState("")
  const [factory, setFactory] = React.useState<any>(null)
  const [web3, setWeb3] = React.useState<any>(null)
  const [Body, setBody] = React.useState<any>(null)

  const getWeb3 = async () => {
    const web3instance = await connectToWallet()
    await setWeb3(web3instance)

    if (web3instance) {

      //const networkId = await web3instance.eth.net.getId();
      //const deployedNetwork = Factory.networks[networkId];

      // const ropstenAddress = "0x696B323fF099AA067DFB9C7f42C71E07cABD19AE"

      const factoryInstance = new web3instance.eth.Contract(
        Factory.abi,
        // deployedNetwork && deployedNetwork.address
        "0x30A6EC50F459400CAC8f296F266066CfdBAd1AAE"
      ) 

      await setFactory(factoryInstance)
      const accounts = await web3instance.eth.getAccounts();

      setBody(<HomePage web3={web3instance} factory={factoryInstance} setBody={setBody}/>)
      setAddress(accounts[0])
    }
  }
  return (
    <div className="app">
      <div className="navbar">
        <a href="https://www.pdx.edu/">
          <img src={logo} alt="Portland State University" />
        </a>
        <div className="address">
          {address}
        </div>
      </div>
      <div className="title">
        <h1>
          <b>
            Time Capsule Submission
          </b>
        </h1>
      </div>
      <div className="container">
        <button onClick={getWeb3} className={clsx({ "NotVisible": address !== "" })}>
          Connect To Wallet
        </button>
      </div>
      <div>
        {Body}
      </div>
    </div>
  )
}

export default App
