import {
  flashBorrowReserveLiquidityInstruction,
  flashRepayReserveLiquidityInstruction,
  SOLEND_PRODUCTION_PROGRAM_ID,
  SOLEND_DEVNET_PROGRAM_ID,
} from "@solendprotocol/solend-sdk";
import BN from "bn.js";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SendTransactionError,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { ComputeBudgetProgram } from "@solana/web3.js";
import bs58 from "bs58";
import { getAssociatedTokenAddress } from "@solana/spl-token";
// const connection = new Connection("https://api.mainnet-beta.solana.com");
const connection = new Connection("https://capable-icy-telescope.solana-mainnet.quiknode.pro/5ad7778c25bcc2c2ab1a8c8fe5b6d8a306414c0c");
// const connection = new Connection("https://api.devnet.solana.com")
const solanaTokenMint = new PublicKey("So11111111111111111111111111111111111111112") 
const walletPublicKey = new PublicKey("2BxKw4qJkZPUVLwXseYFHMxyD5nTd3ntdoys1VXUvVnR")
// const keypairPath = "./wallet-keypair.json";
const private_key = "4eDSRFaKFui8cfKYqfcsP71zqpoPSfpawrTPvxkggXgbPKFmPEmg5G4QxkvCqYhgTNCKMb5tqGsqYrtUNkzwcLR";
const wallet = Keypair.fromSecretKey(bs58.decode(private_key));
console.log(wallet.publicKey.toBase58());
const main_func = async ()=>{
    const tokenAccountAddress = await getAssociatedTokenAddress(
        solanaTokenMint,
         walletPublicKey
       )
    return(tokenAccountAddress)
}
const liquidityAmount = new BN(1000000000);
// const tokenAccount = main_func()
const lendingMarket = new PublicKey(
  "14KjwAAkbgNdSmCHgNkW6bDhUDF4zbpdS5zPPkxYPmK6"
);
const sourceLiquidity = new PublicKey(
  "4AaWCgiCBLkEruE3m3Ms6emhBs62zLCoqotby4iuhmTD"
);


const reserve = new PublicKey("BTQJkUKAMcx3ppM9Qvwck3TCb64vw7b1a2nYmEsKfFWo");
const reserveLiquidityFeeReceiver = new PublicKey(
  "91Ts9nHaeRhcKxChyED3r9HF7rQNqzHo3ye9CmYH7w86"
);

async function flashLoan() {
  const computeUnitMaxLimit = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1000000,
  });
  const blockhash = (await connection.getLatestBlockhash("finalized"))
    .blockhash;

  const flashBorrow = flashBorrowReserveLiquidityInstruction(
    liquidityAmount,
    sourceLiquidity,
    new PublicKey("6i7V6Wy3TqW2JB9e684KEkh9TTWa4dKKTJtz7N4Geven"),
    reserve,
    lendingMarket,
    SOLEND_PRODUCTION_PROGRAM_ID
  );

  const flashRepay = flashRepayReserveLiquidityInstruction(
    liquidityAmount,
    1,
    new PublicKey("6i7V6Wy3TqW2JB9e684KEkh9TTWa4dKKTJtz7N4Geven"),
    sourceLiquidity,
    // sourceLiquidity,
    reserveLiquidityFeeReceiver,
    // reserveLiquidityFeeReceiver,
    new PublicKey("6i7V6Wy3TqW2JB9e684KEkh9TTWa4dKKTJtz7N4Geven"),
    reserve,
    lendingMarket,
    wallet.publicKey,
    SOLEND_PRODUCTION_PROGRAM_ID
  )
//   const flashRepay = flashRepayReserveLiquidityInstruction(
//     liquidityAmount,
//     1,
//     sourceLiquidity,
//     new PublicKey("6i7V6Wy3TqW2JB9e684KEkh9TTWa4dKKTJtz7N4Geven"),
//     // sourceLiquidity,
//     reserveLiquidityFeeReceiver,
//     // reserveLiquidityFeeReceiver,
//     new PublicKey("6i7V6Wy3TqW2JB9e684KEkh9TTWa4dKKTJtz7N4Geven"),
//     reserve,
//     lendingMarket,
//     wallet.publicKey,
//     SOLEND_DEVNET_PROGRAM_ID
//   );

  try {
    const message = new TransactionMessage({
      payerKey: walletPublicKey,
      recentBlockhash: blockhash,
      instructions: [computeUnitMaxLimit, flashBorrow, flashRepay],
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);

    tx.sign([wallet]);

    const simulation = await connection.simulateTransaction(tx);
    console.log("Simulation result:", simulation.value);

    if (simulation.value.err) {
      throw new Error(
        `Simulation failed: ${JSON.stringify(simulation.value.err)}`
      );
    }

    const signature = await connection.sendTransaction(tx, {
      skipPreflight: true,
      maxRetries: 3,
      preflightCommitment: "confirmed",
    });

    const txHash = await connection.sendTransaction(tx);
    console.log("⏳ Waiting for confirmation...")
    await connection.confirmTransaction(txHash, 'processed');

    console.log(
      "Transaction sent successfully with hash:",
      `https://solscan.io/tx/${signature}`
    )
  } catch (error) {
    if (error instanceof SendTransactionError) {
      console.error("Transaction Error:", {
        message: error.message,
        logs: error.logs,
        details: error,
      });
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
}

flashLoan()
// console.log(SOLEND_PRODUCTION_PROGRAM_ID)
