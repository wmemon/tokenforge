import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import createToken from "@/token-generator-helper/createToken";
import {  useConnection, useWallet}  from "@solana/wallet-adapter-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RocketIcon } from "@radix-ui/react-icons"


interface TokenCreatorInfo{
  creatorName: string,
  creatorWebsite: string
}

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

export const LoadingSpinner = () => {
  return(
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin")}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function CustomCreatorInfo({tokenCreatorInfo, setTokenCreatorInfo, tokenInfo, tokenAdditionalSettings, logoURL,  setStep}: {tokenCreatorInfo: TokenCreatorInfo, setTokenCreatorInfo: (info: TokenCreatorInfo) => void, setTokenInfo: (info: TokenInformation) => void , tokenInfo: TokenInformation, tokenAdditionalSettings: TokenAdditionalSettings, setTokenAdditionalSettings: (info: TokenAdditionalSettings) => void, logoURL: string,  setStep: (step: number | ((prev: number) => number)) => void}){
    const [creatorName, setCreatorName] = useState<string>(tokenCreatorInfo.creatorName);
    const [creatorWebsite, setCreatorWebsite] = useState<string>(tokenCreatorInfo.creatorWebsite);
    const [loading, setLoading] = useState<boolean>(false);
    const [mintTo, setMintTo] = useState<string>("");
    const wallet = useWallet();
    const {connection} = useConnection();

    function handleBackButtonClick(){
      setTokenCreatorInfo({...tokenCreatorInfo, creatorName, creatorWebsite})
      setStep((prev) => prev - 1);
    }

    async function handleCreateTokenButtonClick(){
      setLoading(true);
      console.log("Deploy now");
      const mintTo = await createToken(
        {tokenName: tokenInfo.tokenName, 
        tokenSymbol: tokenInfo.tokenSymbol, 
        tokenDecimals: tokenInfo.decimal, 
        tokenSupply: tokenInfo.totalSupply, 
        description: tokenInfo.tokenDescription, 
        logoURL: logoURL, 
        isMutable: false, 
        isRevokeFreeze: false, 
        isRevokeMint: false, 
        creatorName: creatorName, 
        creatorWebsite: creatorWebsite, 
        wallet: wallet, 
        connection:connection
      });


      if(mintTo !== undefined){
        setMintTo(mintTo);
      }
      console.log("Mint to is :" , mintTo)
      console.log("Done");
      setLoading(false);
    }
    return(
      <>
    {
      (mintTo !== "") ?  <Alert className="bg-white m-2">
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Success!</AlertTitle>
                <AlertDescription
            className="cursor-pointer wrap-text"
            onClick={() => {
              navigator.clipboard.writeText(mintTo);
            }}
            title="Click to copy address"
          >
            Minted to {mintTo.slice(0, 5)}...{mintTo.slice(-5)}
          </AlertDescription>

    </Alert> : ""
    }
        <form>
        <div className="grid gap-1.5 leading-none pb-4">
        <label
          htmlFor="customcreatorinfo"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
        Custom Creator Info
        </label>
        <label
          htmlFor="customcreatorinfo"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
        Fee: 0.5 SOL
        </label>
        <p className="text-sm text-muted-foreground">
        Change information about token creator in token metadata
        </p>
      </div>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tokenname">Creator Name </Label>
            <Input id="tokenname" placeholder="Your Name" value={creatorName} onChange={(e) => {setCreatorName(e.target.value)}}/>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tokensymbol">Creator Website </Label>
            <Input id="tokensymbol" placeholder="Your Website" value={creatorWebsite} onChange={(e) => {setCreatorWebsite(e.target.value)}}/>
          </div>
        </div>
        <CardFooter className="flex justify-between p-5">
      <Button type="button" onClick={handleBackButtonClick}>{"Back"}</Button>
        <Button type="button" onClick={handleCreateTokenButtonClick}>
          {loading ? <LoadingSpinner /> : "Next"}
        </Button>
      </CardFooter>
      </form>
      </>
    );
}