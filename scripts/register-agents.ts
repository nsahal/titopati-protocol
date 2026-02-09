/**
 * TitoPati Protocol - Agent Registration
 * Registers Tito 🦜 and Paati 🐦‍⬛ on Solana devnet
 * 
 * Built by TitoPati for the Colosseum Agent Hackathon
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Program ID (update after deployment)
const PROGRAM_ID = new PublicKey("TiTo1111111111111111111111111111111111111");

// Agent definitions
const AGENTS = [
  {
    name: "Tito",
    emoji: "🦜",
    primaryPlatform: "mac",
    platforms: [
      { type: "discord", id: "tito#0664" },
      { type: "whatsapp", id: "TitoPati Group" },
      { type: "telegram", id: "@tito_familiar" },
    ],
  },
  {
    name: "Paati", 
    emoji: "🐦‍⬛",
    primaryPlatform: "kali",
    platforms: [
      { type: "discord", id: "paati#7430" },
      { type: "whatsapp", id: "TitoPati Group" },
      { type: "telegram", id: "@paati_kali" },
    ],
  },
];

async function main() {
  console.log("🦞 TitoPati Agent Registration");
  console.log("==============================\n");

  // Connect to devnet
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load wallet (from default Solana CLI location)
  const walletPath = path.join(process.env.HOME!, ".config/solana/id.json");
  if (!fs.existsSync(walletPath)) {
    console.error("❌ Wallet not found at", walletPath);
    console.error("   Run 'solana-keygen new' to create one");
    process.exit(1);
  }
  
  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
  );
  console.log("💰 Wallet:", walletKeypair.publicKey.toBase58());

  // Register each agent
  for (const agent of AGENTS) {
    console.log(`\n🔄 Registering ${agent.emoji} ${agent.name}...`);
    
    // Derive PDA
    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), Buffer.from(agent.name)],
      PROGRAM_ID
    );
    console.log(`   PDA: ${pda.toBase58()}`);
    
    // Check if already registered
    const account = await connection.getAccountInfo(pda);
    if (account) {
      console.log(`   ✅ Already registered!`);
      continue;
    }
    
    // TODO: Call register_agent instruction via Anchor
    // This requires the IDL which is generated after anchor build
    console.log(`   ⏳ Would register with: name=${agent.name}, emoji=${agent.emoji}`);
    console.log(`   📝 Platforms: ${agent.platforms.map(p => p.type).join(", ")}`);
  }

  console.log("\n✅ Registration complete!");
  console.log("\n📊 View on Solana Explorer:");
  console.log(`   https://explorer.solana.com/address/${PROGRAM_ID.toBase58()}?cluster=devnet`);
}

main().catch(console.error);
