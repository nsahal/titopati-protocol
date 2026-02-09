#!/bin/bash
# TitoPati Protocol - Devnet Deployment
# Built by Tito 🦜 + Paati 🐦‍⬛

set -e

echo "🦞 TitoPati Protocol Deployment"
echo "================================"

# Check Anchor installation
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor not found. Install with: cargo install --git https://github.com/coral-xyz/anchor anchor-cli"
    exit 1
fi

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Install from https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Set to devnet
echo "📡 Switching to devnet..."
solana config set --url devnet

# Check wallet balance
BALANCE=$(solana balance 2>/dev/null | awk '{print $1}')
echo "💰 Wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 1" | bc -l) )); then
    echo "⚠️  Low balance. Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Build the program
echo "🔨 Building program..."
anchor build

# Deploy
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/titopati_registry-keypair.json)
echo ""
echo "✅ Deployed!"
echo "📍 Program ID: $PROGRAM_ID"
echo ""
echo "Next: Run 'npx ts-node scripts/register-agents.ts' to register Tito + Paati"
