import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import LogoImagePreview from "./TokenInformationHelper/LogoImagePreview";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from "@solana/wallet-adapter-react";


export interface TokenInformation {
  tokenName: string,
  tokenSymbol: string,
  decimal: number,
  totalSupply: number,
  tokenImage: File | null,
  tokenDescription: string
}


export default function TokenInformationForm({ tokenInfo, setTokenInfo, setStep, setError }: { tokenInfo: TokenInformation, setTokenInfo: (info: TokenInformation) => void , setStep: (step: number | ((prev: number) => number)) => void ,setError: React.Dispatch<React.SetStateAction<string>>}){

  const [tokenName, setTokenName] = useState<string>(tokenInfo.tokenName);
  const [tokenSymbol, setTokenSymbol] = useState<string>(tokenInfo.tokenSymbol);
  const [tokenDecimal, setTokenDecimal] = useState<number>(tokenInfo.decimal);
  const [tokenSupply, setTokenSupply] = useState<number>(tokenInfo.totalSupply);
  const [logo, setLogo] = useState<File | null>(tokenInfo.tokenImage);
  const [logoURL, setLogoURL] = useState<string>("");
  const [tokenDescription, setTokenDescription] = useState<string>(tokenInfo.tokenDescription);
  const wallet = useWallet();



  async function handleLogoInput(e: { target: { files: FileList | null }; }) {
    if (e.target.files && e.target.files.length > 0) {
      await setLogo(e.target.files[0]);
    }
  }

  useEffect(() => {
    async function handleLogo() {
      if (logo) {
        const lURL = URL.createObjectURL(logo)
        setLogoURL(lURL);
      }
    }
    handleLogo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo]);

  async function handleNextButtonClick() {
    console.log(logo); // Step 1: Ensure logo exists
    console.log(tokenSupply);
    setTokenInfo({
      ...tokenInfo,
      tokenName,
      tokenSymbol,
      decimal: tokenDecimal,
      totalSupply: tokenSupply,
      tokenImage: logo,
      tokenDescription: tokenDescription
    });

    if(!wallet.publicKey){
      setError("Wallet Not connected");
      console.log("wallet not conencted");
      return;
    }

    if(tokenName === "" || tokenName.length > 30){
      setError("Please check the Token Name");
      return;
    }

    if(tokenSymbol === "" || tokenSymbol.length > 10){
      setError("Please check your Token Symbol");
      return;
    }

    if(tokenDecimal > 12 || tokenDecimal < 1 || isNaN(tokenDecimal)){
      setError("Token Decimal Not Valid");
      return;
    }

    if(tokenSupply < 1 || isNaN(tokenSupply)){
      setError("Token Supply Not Valid");
      return;
    }

    if(tokenDescription === ""){
      setError("Please check your Token Description");
      return;
    }
    
    if (logo) {
      try {
        // // Step 2: Upload logo to Pinata
        // const upload = await pinata.upload.file(logo);
        // console.log(upload); // Check the upload result
        
        // // Step 3: Set token info once upload is successful
        // const tURL = gateway + "/ipfs/" + upload.IpfsHash.toString();
        setTokenInfo({
          ...tokenInfo,
          tokenName,
          tokenSymbol,
          decimal: tokenDecimal,
          totalSupply: tokenSupply,
          tokenImage: logo,
          tokenDescription: tokenDescription
        });
        
        // Step 4: Proceed to the next step only after all previous code is complete
        setStep((prev: number) => prev + 1);
      } catch (error) {
        console.error("Error during file upload or token info update:", error);
      }
    } else {
      setError("Please add a logo")
      console.error("Logo is missing");
      return;
    }
  }
  
  return (
    <form>

      <div className="grid w-full items-center gap-4">

      <div className="flex justify-center">
                <WalletMultiButton/>
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tokenname">Token Name (Max 30)* </Label>
          <Input required id="tokenname" placeholder="Name of your project" maxLength={30} value={tokenName} onChange={(e) => { setTokenName(e.target.value) }} />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tokensymbol">Token Symbol (Max 10)* </Label>
          <Input id="tokensymbol" placeholder="Symbol of your project" maxLength={10} value={tokenSymbol} onChange={(e) => { setTokenSymbol(e.target.value) }} />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tokendecimals">Decimals </Label>
          <Input id="tokendecimals" placeholder="1-11" type={"number"} value={tokenDecimal} onChange={(e) => { setTokenDecimal(parseInt(e.target.value)) }} />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tokensupply">Supply </Label>
          <Input required id="tokensupply" placeholder="Total Supply" type={"number"} value={tokenSupply} onChange={(e) => { setTokenSupply(parseInt(e.target.value)) }} />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div className="flex justify-center gap-2 items-center">
            {logo ? <LogoImagePreview image={logoURL} /> : ""}
            <Label htmlFor="picture">Logo</Label>
          </div>
          <Input id="picture" type="file" onChange={handleLogoInput} />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Here you can briefly describe your token" value={tokenDescription} onChange={(e) => { setTokenDescription(e.target.value) }} />
        </div>
      </div>
      
      <CardFooter className="flex justify-end p-5">
        <Button type="submit" onClick={handleNextButtonClick}>{"Next"}</Button>
      </CardFooter>
    </form>
  );
}
