
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import './App.css'
import { Progress } from './components/ui/progress'
import CardWithForm from './token-generator/CardWithForm'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,

} from '@solana/wallet-adapter-react-ui';
import Menubar from './Topbar/Menubar';
import { useEffect, useState } from 'react';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
 

function AlertDestructive({error , setError}: {error: string , setError: React.Dispatch<React.SetStateAction<string>>}) {
  if(error)
  return (
    <div>
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
    </div>
  )
}

function App() {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if(error !== ""){
      setInterval(() => {setError("")}, 3000)
    }
  }, [error])

  return (
    <div className="h-auto">
      <ConnectionProvider endpoint={'https://solana-devnet.g.alchemy.com/v2/yV8uf_2Ss1pPDEVsNL36hiOKqv7ctRH3'}> 
      <WalletProvider wallets={[]} autoConnect={false}>
        <WalletModalProvider>
          <Menubar />
          <AlertDestructive error={error} setError={setError}/>
          <div className="grid md:grid-cols-3">
          <div className="col-span-full md:col-start-2 md:col-span-1 p-5">
           <CardWithForm step={step} setStep={setStep} setError = {setError}/>
           <div className='p-10'>
              <Progress value={33.33*step} />
              Step {step} of 3
           </div>
           </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
      </ConnectionProvider>
  <div/>
  </div>
  )
}

export default App
