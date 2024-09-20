import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import TokenInformationForm from "./TokenInformationForm"
import TokenAdditionalSettings from "./TokenAdditionalSettings"
import CustomCreatorInfo from "./CustomCreatorInfo"
import { useEffect, useState } from "react"
import { PinataSDK } from 'pinata';


interface TokenInformation {
  tokenName: string,
  tokenSymbol: string,
  decimal: number,
  totalSupply: number,
  tokenImage: File | null,
  tokenDescription: string
}

interface TokenAdditionalSettings {
  immutable: boolean,
  revokeMint: boolean,
  revokeFreeze: boolean
}

interface TokenCreatorInfo {
  creatorName: string,
  creatorWebsite: string
}


export default function CardWithForm({step, setStep, setError}: {step: number, setStep: React.Dispatch<React.SetStateAction<number>>, setError: React.Dispatch<React.SetStateAction<string>>}) {

  const gateway = "chocolate-main-walrus-517.mypinata.cloud"
  const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Mjc4NDJjYy1mYzVkLTQ2NDQtOTA3OC01NTExOTYwN2I1M2YiLCJlbWFpbCI6IndtZW1vbjEwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDA3MmM3ZmRjYThhZDgxNGM0NWMiLCJzY29wZWRLZXlTZWNyZXQiOiI3YThkYTBhMzQ2MmZlMWQ1MTBkMTk5ZTI1NWFmZTgyYTZhYzM0YjE1OGRkZWYwMmFlZjU2MjhiNWU0NzRjMTZkIiwiaWF0IjoxNzI1NTE0MzU2fQ.8CTEP_fThZyQ-fNmxxhQTQMhux22DCeAWKF9LeAC4FQ",
    pinataGateway: gateway,
  });

  const [tokenInfo, setTokenInfo] = useState<TokenInformation>({ tokenName: '', tokenSymbol: '', decimal: 9, totalSupply: 0, tokenImage: null, tokenDescription: '' })
  const [tokenAdditionalSettings, setTokenAdditionalSettings] = useState<TokenAdditionalSettings>({ immutable: false, revokeMint: false, revokeFreeze: false });
  const [tokenCreatorInfo, setTokenCreatorInfo] = useState<TokenCreatorInfo>({ creatorName: "tokenForge", creatorWebsite: "https://www.tokenforge.com" })
  const [logoURL, setLogoURL] = useState<string>("");
  //const [tokenJsonData, setTokenJsonData] = useState<object>({});

  useEffect(() => {
    async function handleLogoUplaod() {
      if (tokenInfo.tokenImage !== null) {
        const upload = await pinata.upload.file(tokenInfo.tokenImage);
        const signedURL = await pinata.gateways.createSignedURL({
          cid: upload.cid,
          expires: 5000000,
        });
        console.log("Signed URL is: ", signedURL);
        setLogoURL(signedURL);
      }
    }

    handleLogoUplaod();
    console.log(logoURL);

  }, [tokenInfo.tokenImage])


  useEffect(() => {
    if(tokenInfo.tokenName !== "" && tokenInfo.tokenDescription !== "" && tokenInfo.tokenImage !== null && tokenInfo.tokenSymbol !== "" && tokenInfo.totalSupply !== 0 && tokenCreatorInfo.creatorName !== "" && tokenCreatorInfo.creatorWebsite !== ""){
    //const jsonData = { "name": tokenInfo.tokenName, "symbol": tokenInfo.tokenSymbol, "description": tokenInfo.tokenDescription, "image": logoURL, "extensions": {}, "creator": { "name": tokenCreatorInfo.creatorName, "site": tokenCreatorInfo.creatorWebsite } }
    }
  }, [tokenInfo])

  function CurrentStep() {
    if (step === 1) {
      return <TokenInformationForm setTokenInfo={setTokenInfo} tokenInfo={tokenInfo} setStep={setStep} setError={setError}/>
    }
    else if (step === 2) {
      return <TokenAdditionalSettings tokenAdditionalsettings={tokenAdditionalSettings} setTokenAdditionalSettings={setTokenAdditionalSettings} setStep={setStep} />
    }
    else if (step === 3) {
      return <CustomCreatorInfo tokenCreatorInfo={tokenCreatorInfo} setTokenCreatorInfo={setTokenCreatorInfo} tokenInfo={tokenInfo} setTokenInfo={setTokenInfo} logoURL={logoURL} setStep={setStep} />
    }
  }

  return (
    <Card className="w-[4/5]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <CurrentStep />
      </CardContent>
    </Card>
  )
}
