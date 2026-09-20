import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";

export async function loadPump() {
  return import("@pump-fun/pump-sdk");
}

export async function sendInstructions(
  connection: Connection,
  payer: PublicKey,
  signTransaction: (tx: Transaction) => Promise<Transaction>,
  instructions: TransactionInstruction[],
) {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  const tx = new Transaction();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer;
  tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }), ...instructions);
  const signed = await signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
  });
  await connection.confirmTransaction(
    { signature: sig, blockhash, lastValidBlockHeight },
    "confirmed",
  );
  return sig;
}

export async function createPumpTokenInstructions(params: {
  connection: Connection;
  user: PublicKey;
  mint: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  buyLamports: number;
}) {
  const { OnlinePumpSdk, PUMP_SDK, getBuyTokenAmountFromSolAmount } = await loadPump();
  const online = new OnlinePumpSdk(params.connection);

  if (params.buyLamports <= 0) {
    return [
      await PUMP_SDK.createV2Instruction({
        mint: params.mint,
        name: params.name,
        symbol: params.symbol,
        uri: params.uri,
        creator: params.user,
        user: params.user,
        mayhemMode: false,
      }),
    ];
  }

  const global = await online.fetchGlobal();
  const feeConfig = await online.fetchFeeConfig().catch(() => null);
  const solAmount = new BN(params.buyLamports);
  const amount = getBuyTokenAmountFromSolAmount({
    global,
    feeConfig,
    mintSupply: null,
    bondingCurve: null,
    amount: solAmount,
    quoteMint: NATIVE_MINT,
  });

  return PUMP_SDK.createV2AndBuyInstructions({
    global,
    mint: params.mint,
    name: params.name,
    symbol: params.symbol,
    uri: params.uri,
    creator: params.user,
    user: params.user,
    amount,
    solAmount,
    mayhemMode: false,
  });
}

export async function createSharingAndLock(params: {
  connection: Connection;
  creator: PublicKey;
  mint: PublicKey;
  shareholders: { address: PublicKey; shareBps: number }[];
  pool?: PublicKey | null;
}) {
  const { PUMP_SDK, canonicalPumpPoolPda } = await loadPump();
  let pool: PublicKey | null = params.pool ?? null;
  if (params.pool === undefined) {
    try {
      const guessed = canonicalPumpPoolPda(params.mint);
      const info = await params.connection.getAccountInfo(guessed);
      pool = info ? guessed : null;
    } catch {
      pool = null;
    }
  }

  const createIx = await PUMP_SDK.createFeeSharingConfig({
    creator: params.creator,
    mint: params.mint,
    pool,
  });

  const updateIx = await PUMP_SDK.updateFeeSharesV2({
    authority: params.creator,
    mint: params.mint,
    currentShareholders: [params.creator],
    newShareholders: params.shareholders,
    quoteMint: NATIVE_MINT,
    quoteTokenProgram: TOKEN_PROGRAM_ID,
  });

  return { createIx, updateIx };
}

export async function distributeFees(params: {
  connection: Connection;
  payer: PublicKey;
  mint: PublicKey;
}) {
  const { PUMP_SDK, feeSharingConfigPda } = await loadPump();
  const sharingConfigAddress = feeSharingConfigPda(params.mint);
  const info = await params.connection.getAccountInfo(sharingConfigAddress);
  if (!info) throw new Error("No sharing_config for this mint. Route fees first.");
  const sharingConfig = PUMP_SDK.decodeSharingConfig(info);
  const ix = await PUMP_SDK.distributeCreatorFeesV2({
    mint: params.mint,
    sharingConfig,
    sharingConfigAddress,
    quoteMint: NATIVE_MINT,
    payer: params.payer,
    shouldInitializeAta: true,
    quoteTokenProgram: TOKEN_PROGRAM_ID,
  });
  return { ix, sharingConfigAddress };
}

export function newMintKeypair() {
  return Keypair.generate();
}
