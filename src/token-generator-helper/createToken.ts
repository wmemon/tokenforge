import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    createMintToInstruction,
    ExtensionType,
    getAssociatedTokenAddressSync,
    getMintLen,
    getOrCreateAssociatedTokenAccount,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
} from '@solana/spl-token';
import type { TokenMetadata } from '@solana/spl-token-metadata';
import {
    createInitializeInstruction,
    pack,
    createUpdateFieldInstruction,
} from '@solana/spl-token-metadata';
import { ConnectionContextState } from '@solana/wallet-adapter-react';
import createAndUploadJson from './createAndUploadJson';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface TokenCreatorIface{
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenSupply: number,
    logoURL: string,
    description: string,
    isMutable: boolean,
    isRevokeMint: boolean,
    isRevokeFreeze: boolean,
    creatorName: string,
    creatorWebsite: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connection: any
}


export default async function createToken({tokenName, tokenSymbol, tokenDecimals, tokenSupply, logoURL, description, isMutable, isRevokeMint, isRevokeFreeze, creatorName, creatorWebsite, wallet, connection}: TokenCreatorIface){
        const associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID;
        console.log(wallet);
        const payerKey = wallet.publicKey;
        const mint = Keypair.generate();
        const decimals = tokenDecimals;
        const tokenURI = await createAndUploadJson({tokenName: tokenName, tokenDescription: description, tokenImageURL: logoURL, tokenSymbol: tokenSymbol, creatorName: creatorName, creatorWebsite: creatorWebsite})
        if(!tokenURI){
            return;
        }
        const metadata: TokenMetadata = {
            mint: mint.publicKey,
            name: tokenName,
            symbol: tokenSymbol,
            uri: tokenURI,
            additionalMetadata: [["creator", {"name": creatorName, "site": creatorWebsite}.toString()]],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);


        try{
            if(!payerKey){
                console.error("Wallet not found");
                return;
            }

            if(!logoURL){
                console.error("Logo URL not found");
                return;
            }
            const mintTransaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: payerKey,
                    newAccountPubkey: mint.publicKey,
                    space : mintLen,
                    lamports: mintLamports,
                    programId: TOKEN_2022_PROGRAM_ID
                }),
                createInitializeMetadataPointerInstruction(
                    mint.publicKey,
                    payerKey,
                    mint.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
                createInitializeMintInstruction(mint.publicKey, decimals, payerKey, null, TOKEN_2022_PROGRAM_ID),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mint.publicKey,
                    metadata: mint.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: payerKey,
                    updateAuthority: payerKey,
                }),
                       // add a custom field
                createUpdateFieldInstruction({
                    metadata: mint.publicKey,
                    updateAuthority: payerKey,
                    programId: TOKEN_2022_PROGRAM_ID,
                    field: 'creatorName',
                    value: creatorName,
                }),
                // createUpdateFieldInstruction({
                //     metadata: mint.publicKey,
                //     updateAuthority: payerKey,
                //     programId: TOKEN_2022_PROGRAM_ID,
                //     field: 'creatorWebsite',
                //     value: creatorWebsite,
                // }),

            )
            
            const latestblockhash =  (await connection.getLatestBlockhash());
            mintTransaction.recentBlockhash = latestblockhash.blockhash;
            mintTransaction.feePayer = payerKey;
            await mintTransaction.partialSign(mint);
            // const signature = await wallet.signTransaction(mintTransaction);
            const signature = await wallet.sendTransaction(mintTransaction, connection);
            console.log(signature);
            console.log(`Token mint created at ${mint.publicKey.toBase58()}`);

            const associatedToken = getAssociatedTokenAddressSync(
                mint.publicKey,
                payerKey,
                false,
                TOKEN_2022_PROGRAM_ID,
                associatedTokenProgramId
            );

            console.log(associatedToken.toBase58());

            try {
                const AssociatedTokenTransaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        payerKey,
                        associatedToken,
                        payerKey,
                        mint.publicKey,
                        TOKEN_2022_PROGRAM_ID,
                        associatedTokenProgramId
                    )
                );
                
                let latestblockhash =  (await connection.getLatestBlockhash());
                AssociatedTokenTransaction.recentBlockhash = latestblockhash.blockhash;
                AssociatedTokenTransaction.feePayer = payerKey;
                const signAssociated = await wallet.sendTransaction(AssociatedTokenTransaction, connection);

                const MintToTransaction = new Transaction().add(
                    createMintToInstruction(mint.publicKey, associatedToken, payerKey, tokenSupply * Math.pow(10, decimals), [] ,TOKEN_2022_PROGRAM_ID)
                );

                latestblockhash =  (await connection.getLatestBlockhash());
                MintToTransaction.recentBlockhash = latestblockhash.blockhash;
                MintToTransaction.feePayer = payerKey;

                const mintTo = await wallet.sendTransaction(MintToTransaction, connection);

                console.log("Minted to : " , associatedToken.toBase58());
                return(associatedToken.toBase58())

            } catch (error: unknown) {
                // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                // instruction error if the associated account exists already.
            }

        } catch(e: unknown){
            if(e instanceof Error){
                console.log("There was a problem with the transaction: ", e.toString());
                return undefined;
            }
            else {
                console.log("An unknown error occured");
                return undefined;
            }
        }


}