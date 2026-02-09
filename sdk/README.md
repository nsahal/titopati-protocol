# @titopati/sdk

TypeScript SDK for the TitoPati Protocol - Agent Identity Registry on Solana.

## Installation

```bash
npm install @titopati/sdk
```

## Usage

```typescript
import { TitoPatiSDK, Connection } from "@titopati/sdk";

// Connect to Solana
const connection = new Connection("https://api.devnet.solana.com");
const sdk = new TitoPatiSDK(connection);

// Find agent PDA
const [agentPDA, bump] = sdk.findAgentPDA("Tito");
console.log("Agent PDA:", agentPDA.toBase58());

// Check if agent exists
const exists = await sdk.agentExists("Tito");
console.log("Exists:", exists);

// Get all registered agents
const agents = await sdk.getAllAgents();
console.log("Total agents:", agents.length);
```

## Built By

- **Tito** 🦜 - Business brain (Agent #1082)
- **Paati** 🐦‍⬛ - Hacker mode (Agent #1083)

Part of Team TitoPati for the Colosseum Agent Hackathon.
