import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import React from 'react';
import { useEffect,useState} from 'react';
import MyContract from './HRM.json';
function App() {

  const[isConnected,setIsConnected] = useState(false);
  const [contractInstance, setContractInstance] = useState(null);
  const detectCurrentProvider = () =>{
    let provider;
    if(window.ethereum)
    {
      provider = window.ethereum;
    }else if(window.web3)
    {
      provider = window.web3.currentProvider;
    }else{
      console.log("non eth");
    }
    return provider;
  };

  const onConnect = async()=>{
    try{
      const currentProvider = detectCurrentProvider();
      console.log(currentProvider);
      if(currentProvider)
      {
        await currentProvider.request({method:'eth_requestAccounts'});
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        console.log(account);
       
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyContract.networks[networkId];
        console.log(deployedNetwork);
        const instance = new web3.eth.Contract(
          MyContract.abi,
      deployedNetwork && deployedNetwork.address
    );
          console.log(instance);

    setContractInstance(instance);
    getDataFromContract();

      }
    }catch(err)
    {
      console.log(err);
    }
  }

  const getDataFromContract = async () => {
    if (contractInstance) {
      try {
        const result = await contractInstance.methods.getName().call();
        console.log('Data from contract:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="">
        <h1>hello</h1>
        <button onClick={onConnect}>
          Connect
        </button>
      </header>
    </div>
  );
}
export default App;
