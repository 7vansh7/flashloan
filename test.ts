import { flashBorrowReserveLiquidityInstruction, flashRepayReserveLiquidityInstruction,SOLEND_ADDRESSES } from '@solendprotocol/solend-sdk';
import BN from 'bn.js';
import { Connection, Keypair, PublicKey, Transaction, SendTransactionError, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import * as fs from 'fs';
import { ComputeBudgetProgram } from '@solana/web3.js';
import bs58 from "bs58"
import {createAssociatedTokenAccountInstruction, getAssociatedTokenAddress,getAssociatedTokenAddressSync} from "@solana/spl-token";
const connection = new Connection("https://api.devnet.solana.com");


// const private_key = '4eDSRFaKFui8cfKYqfcsP71zqpoPSfpawrTPvxkggXgbPKFmPEmg5G4QxkvCqYhgTNCKMb5tqGsqYrtUNkzwcLR'

// console.log(bs58.decode(private_key))
// wallet = Keypair.fromSecretKey(Uint8Array.from(private_key))

// const connection = new Connection("https://api.mainnet-beta.solana.com") 
const walletAddress = new PublicKey("2BxKw4qJkZPUVLwXseYFHMxyD5nTd3ntdoys1VXUvVnR")
// const walletAddress = new PublicKey("246RU3QDiDDJzVoWVtLKYGgwDNNApuiYZxnPqpdhDwdt")
const solanaTokenMint = new PublicKey("So11111111111111111111111111111111111111112") 
const jupiterMint = new PublicKey("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN")

async function getTokenAccounts() {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") // Solana SPL Token Program ID
    });

    tokenAccounts.value.forEach((accountInfo) => {
        const tokenAddress = accountInfo.account.data.parsed;
        console.log("Token Address:", tokenAddress);
    });
}


// const tokenAccountAddress = await getAssociatedTokenAddress(
//    solanaTokeMint,
//     walletAddress
//   )

// const createAssociatedAccountInstruc = createAssociatedTokenAccountInstruction(
//       walletAddress,
//       tokenAccountAddress,
//       walletAddress,
//       solanaTokeMint
//     )

const main_func = async ()=>{
    const tokenAccountAddress = await getAssociatedTokenAddress(
        solanaTokenMint,
         walletAddress
       )
    console.log(tokenAccountAddress)
}

// main_func()
const userTokenAtaPk =  getAssociatedTokenAddressSync(
    solanaTokenMint,
   new PublicKey("2BxKw4qJkZPUVLwXseYFHMxyD5nTd3ntdoys1VXUvVnR"),
 
     );
console.log(userTokenAtaPk)

const hostTokenAtaPk =  getAssociatedTokenAddress(
solanaTokenMint,
walletAddress
);

console.log(SOLEND_ADDRESSES)