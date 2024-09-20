import { WalletConnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Menubar(){
  return <div className="flex-no-wrap flex w-full items-center justify-evenly bg-[#FBFBFB] py-2 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-evenly lg:py-4 rounded p-2">
    <div className="font-bold">TokenForge</div>
    <div className="ml-auto">
      <WalletMultiButton />
    </div>
  </div>
}