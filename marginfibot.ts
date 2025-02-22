import { Connection, ComputeBudgetProgram, LAMPORTS_PER_SOL,Transaction } from "@solana/web3.js";
import { MarginfiClient, getConfig, } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { getMarginfiClient } from "./utils";

// const connection = new Connection("https://api.mainnet-beta.solana.com");
// const connection = new Connection("https://api.devnet.solana.com");
const connection = new Connection("https://capable-icy-telescope.solana-mainnet.quiknode.pro/5ad7778c25bcc2c2ab1a8c8fe5b6d8a306414c0c");

const wallet = NodeWallet.local();
// console.log(wallet.publicKey)
const config = getConfig("mainnet-test-1");

async function main() {
// const client = await getMarginfiClient({ readonly: true })
const client = await MarginfiClient.fetch(config, wallet, connection);
const marginfiAccount = await client.createMarginfiAccount();
// const ix = client.makeCreateMarginfiAccountIx(wallet.publicKey)
// const transaction = new Transaction().add(computeBudgetIx, ix)
  const marginfiAccounts = await client.getMarginfiAccountsForAuthority();
  if (marginfiAccounts.length === 0) throw Error("No marginfi account found");
  const check = marginfiAccount.isFlashLoanEnabled
  console.log(check)
//   const marginfiAccount = marginfiAccounts[0];


  const solBank = client.getBankByTokenSymbol("SOL");
  if (!solBank) throw Error("SOL bank not found");
//   await marginfiAccount.deposit(1, solBank.address);
//   await marginfiAccount.reload();

  const amount = 10; // SOL

  const borrowIx = await marginfiAccount.makeBorrowIx(amount, solBank.address);
  const repayIx = await marginfiAccount.makeRepayIx(amount, solBank.address, true);
  const computeBudgetIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 100000,
  });

  const flashLoanTx = await marginfiAccount.buildFlashLoanTx({
    ixs: [...borrowIx.instructions, ...repayIx.instructions,computeBudgetIx],
    signers: [wallet.payer]
  });


  await client.processTransaction(flashLoanTx);
}

main().catch((e) => console.log(e));