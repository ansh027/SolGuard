/**
 * Mock data for demo mode — lets judges see the full dashboard
 * without needing a wallet or API key.
 */

export const DEMO_WALLET = {
  address: '7nYB4g7xKLy9V3k2Rp8xRvZ1dQ3mN5jH8cW2pL4x4Kp',
  balance: 12.4821,
  tokenCount: 5,
};

export const DEMO_SCORE = {
  score: 82,
  grade: 'B+',
  summary: 'Your wallet shows generally safe behavior with a few minor risk patterns from interactions with unverified programs.',
  risks: [
    {
      title: 'Unverified Program Interaction',
      severity: 'medium',
      detail: 'You interacted with 2 programs that are not part of the official Solana program registry. While not inherently dangerous, unverified programs carry higher risk.',
    },
    {
      title: 'Token Approval to Unknown Contract',
      severity: 'low',
      detail: 'A token approval was granted to an address with no on-chain verification. Consider revoking if you no longer use this dApp.',
    },
  ],
  positives: [
    'Majority of transactions use verified Solana system programs',
    'No large outflows to unknown addresses detected',
    'Consistent transaction patterns — no erratic behavior',
    'Wallet has been active for 30+ days with stable patterns',
  ],
};

export const DEMO_TRANSACTIONS = [
  {
    signature: '5UfDkz8R3X7nYJq2WpT1vM9hL4cB6aKs3dF8gN0jH7kP2rE4xQ9wA1tC5bV3mZ6y',
    slot: 284912847,
    blockTime: Math.floor(Date.now() / 1000) - 300,
    err: null,
    memo: null,
    confirmationStatus: 'finalized',
  },
  {
    signature: '3KmN7pL2hJ5gR8dX4cW1vB6tY9qA0sF3eD7iU2oP5nM8kL1jH4gF6dS9aW2xC3v',
    slot: 284912501,
    blockTime: Math.floor(Date.now() / 1000) - 1800,
    err: null,
    memo: null,
    confirmationStatus: 'finalized',
  },
  {
    signature: '7RtY2uI5oP8aS1dF4gH7jK0lZ3xC6vB9nM2qW5eR8tY1uI4oP7aS0dF3gH6jK9l',
    slot: 284911923,
    blockTime: Math.floor(Date.now() / 1000) - 7200,
    err: null,
    memo: null,
    confirmationStatus: 'finalized',
  },
  {
    signature: '9QwE3rT6yU8iO1pA4sD7fG0hJ3kL6zX9cV2bN5mQ8wE1rT4yU7iO0pA3sD6fG9h',
    slot: 284910142,
    blockTime: Math.floor(Date.now() / 1000) - 14400,
    err: { InstructionError: [0, 'Custom'] },
    memo: null,
    confirmationStatus: 'finalized',
  },
  {
    signature: '2AzX5cV8bN1mQ4wE7rT0yU3iO6pA9sD2fG5hJ8kL1zX4cV7bN0mQ3wE6rT9yU2i',
    slot: 284908876,
    blockTime: Math.floor(Date.now() / 1000) - 28800,
    err: null,
    memo: null,
    confirmationStatus: 'finalized',
  },
  {
    signature: '4FgH7jK0lZ3xC6vB9nM2qW5eR8tY1uI4oP7aS0dF3gH6jK9lZ2xC5vB8nM1qW4e',
    slot: 284907321,
    blockTime: Math.floor(Date.now() / 1000) - 43200,
    err: null,
    memo: null,
    confirmationStatus: 'finalized',
  },
];

export const DEMO_ANALYSIS = {
  riskLevel: 'low',
  score: 78,
  summary: 'This transaction interacts with an unverified program but shows no direct signs of malicious intent.',
  details: 'The transaction calls a custom program deployed on devnet. The program ID does not match any known DeFi protocols or verified contracts. The transaction transfers 0.5 SOL and invokes two instructions. While the program is unverified, the transaction structure follows standard patterns and does not attempt to drain the wallet.',
  flags: [
    'Interaction with unverified program',
    'Custom program invocation (2 instructions)',
    'Moderate SOL transfer (0.5 SOL)',
  ],
  recommendation: 'This transaction appears relatively safe but involves an unverified program. If you recognize the dApp, no action needed. If this was unexpected, consider monitoring your wallet for follow-up transactions.',
};

export const DEMO_ANALYSIS_SAFE = {
  riskLevel: 'safe',
  score: 95,
  summary: 'Standard SOL transfer using the System Program — no risk detected.',
  details: 'This is a simple SOL transfer using the official Solana System Program. The recipient address has a clean history with no association to known scam wallets. The transfer amount is small and consistent with normal usage patterns.',
  flags: [],
  recommendation: 'No action needed. This is a standard, safe transaction.',
};

export const DEMO_ANALYSIS_DANGER = {
  riskLevel: 'high',
  score: 25,
  summary: 'Transaction failed — attempted interaction with a suspicious unverified program.',
  details: 'This transaction attempted to interact with an unverified program and failed with a custom error. The program has been flagged in community databases for potential token drain behavior. The failure prevented any funds from being lost, but the attempt itself is concerning.',
  flags: [
    'Failed transaction with custom error',
    'Interaction with flagged program',
    'Potential token drain attempt detected',
    'Program not in verified registry',
  ],
  recommendation: 'URGENT: Review all recent token approvals. This program has been associated with wallet drainers. Consider revoking any approvals granted to this program immediately.',
};
