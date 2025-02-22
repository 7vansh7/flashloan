// import inquirer from "inquirer";
import { MarginfiClient, MarginfiConfig, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { Connection, PublicKey } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";

// export async function confirmOrAbort(prompt: string) {
//   const answer = await inquirer.prompt([
//     {
//       type: "confirm",
//       name: "confirm",
//       message: prompt,
//       default: false,
//     },
//   ]);
//   if (!answer.confirm) {
//     console.log("Aborting");
//     process.exit(1);
//   }
// }

export async function getMarginfiClient({
  readonly,
  authority,
  configOverride,
}: {
  readonly?: boolean;
  authority?: PublicKey;
  configOverride?: MarginfiConfig;
} = {}): Promise<MarginfiClient> {
//   const connection = new Connection(env_config.RPC_ENDPOINT, "confirmed");
const connection = new Connection("https://capable-icy-telescope.solana-mainnet.quiknode.pro/5ad7778c25bcc2c2ab1a8c8fe5b6d8a306414c0c");  
const wallet = NodeWallet.local();
  const config = getConfig('mainnet-test-1')

  if (authority && !readonly) {
    throw Error("Can only specify authority when readonly");
  }

  const client = await MarginfiClient.fetch(
    config,
    authority ? ({ publicKey: authority } as any) : wallet,
    connection,
    { readOnly: readonly, preloadedBankAddresses: [] }
  );

  return client;
}