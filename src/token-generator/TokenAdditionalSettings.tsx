import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TokenAdditionalSettings {
  immutable: boolean,
  revokeMint: boolean,
  revokeFreeze: boolean
}

export default function TokenAdditionalSettings({tokenAdditionalsettings, setTokenAdditionalSettings, setStep}: {tokenAdditionalsettings: TokenAdditionalSettings, setTokenAdditionalSettings: (info: TokenAdditionalSettings) => void, setStep: (step: number | ((prev: number) => number)) => void }){

  const [isTokenImmutable, setTokenImmutable] = useState<boolean>(tokenAdditionalsettings.immutable);
  const [isRevoke, setTokenRevoke] = useState<boolean>(tokenAdditionalsettings.revokeMint);
  const [isFreeze, setTokenFreeze] = useState<boolean>(tokenAdditionalsettings.revokeFreeze);

  function handleNextButtonClick(){
    setTokenAdditionalSettings({ ...tokenAdditionalsettings,immutable: isTokenImmutable, revokeMint: isRevoke, revokeFreeze: isFreeze});
    setStep((prev: number) => (prev + 1));
  }

  function handleBackButtonClick(){
    setStep((prev: number) => (prev - 1));
  }

  return (
    <form>
      {/* Checkbox 1 */}
      <div className="items-top flex space-x-1 items-start">
        <Checkbox id="immutable" disabled={true} checked={isTokenImmutable} onCheckedChange={() => {setTokenImmutable((val) => !val)}}/>
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="immutable"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <div className="flex px-2 justify-around">Immutable</div>
          </label>
          <p className="text-sm text-muted-foreground">
            If your token is immutable, it means you will not be able to update
            token metadata. (Coming Soon)
          </p>
        </div>
      </div>

      {/* Checkbox 2 */}
      <div className="items-top flex space-x-1 items-start pt-3">
        <Checkbox id="revokemint" disabled={true} checked={isRevoke} onCheckedChange={() => {setTokenRevoke(!isRevoke)}}/>
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="revokemint"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <div className="flex justify-around px-2">
              <span>Revoke Mint Authority</span>
              <span>Fee: 0.1 SOL</span>
            </div>
          </label>
          <p className="text-sm text-muted-foreground">
            Prevent additional token supply to increase investors' trust. (Coming Soon)
          </p>
        </div>
      </div>

      {/* Checkbox 3 */}
      <div className="items-top flex space-x-1 items-start pt-3">
        <Checkbox id="revokefreeze" disabled={true} checked={isFreeze} onCheckedChange={() => {setTokenFreeze((val) => !val)}}/>
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="revokefreeze"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <div className="flex justify-evenly px-2 gap-5">
              <span>Revoke Freeze Authority</span>
              <span>Fee: 0.1 SOL</span>
            </div>
          </label>
          <p className="text-sm text-muted-foreground">
            Prevent token freezing. (Coming Soon)
          </p>
        </div>
      </div>

      <CardFooter className="flex justify-between p-5">
      <Button type="button" onClick={handleBackButtonClick}>{"Back"}</Button>
        <Button type="button" onClick={handleNextButtonClick}>{"Next"}</Button>
      </CardFooter>
    </form>
  );
}
