import { LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Format a wallet address for display (e.g. "7nYB...x4Kp")
 */
export function formatAddress(address, chars = 4) {
  if (!address) return '';
  const str = address.toString();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

/**
 * Fetch SOL balance for a wallet
 */
export async function fetchBalance(connection, publicKey) {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (err) {
    console.error('Failed to fetch balance:', err);
    return 0;
  }
}

/**
 * Fetch recent transaction signatures + basic details
 */
export async function fetchTransactions(connection, publicKey, limit = 15) {
  try {
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });

    const transactions = signatures.map((sig) => ({
      signature: sig.signature,
      slot: sig.slot,
      blockTime: sig.blockTime,
      err: sig.err,
      memo: sig.memo,
      confirmationStatus: sig.confirmationStatus,
    }));

    return transactions;
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    return [];
  }
}

/**
 * Fetch parsed transaction details for deeper analysis
 */
export async function fetchTransactionDetail(connection, signature) {
  try {
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) return null;

    const { meta, transaction, blockTime } = tx;

    return {
      signature,
      blockTime,
      fee: meta?.fee || 0,
      err: meta?.err,
      preBalances: meta?.preBalances || [],
      postBalances: meta?.postBalances || [],
      instructions: transaction?.message?.instructions?.map((ix) => ({
        programId: ix.programId?.toString(),
        program: ix.program || null,
        type: ix.parsed?.type || null,
        info: ix.parsed?.info || null,
        data: ix.data || null,
      })) || [],
      logMessages: meta?.logMessages || [],
    };
  } catch (err) {
    console.error('Failed to fetch transaction detail:', err);
    return null;
  }
}

/**
 * Fetch SPL token accounts
 */
export async function fetchTokenAccounts(connection, publicKey) {
  try {
    const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new (await import('@solana/web3.js')).PublicKey(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
    });

    return response.value.map((account) => {
      const info = account.account.data.parsed?.info;
      return {
        mint: info?.mint,
        balance: info?.tokenAmount?.uiAmount || 0,
        decimals: info?.tokenAmount?.decimals || 0,
      };
    });
  } catch (err) {
    console.error('Failed to fetch token accounts:', err);
    return [];
  }
}

/**
 * Format a timestamp to readable string
 */
export function formatTimestamp(blockTime) {
  if (!blockTime) return 'Unknown';
  return new Date(blockTime * 1000).toLocaleString();
}

/**
 * Get Solana Explorer URL for a transaction
 */
export function getExplorerUrl(signature, cluster = 'devnet') {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
}
