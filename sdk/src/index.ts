import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";

// Program ID (will be updated after deployment)
export const PROGRAM_ID = new PublicKey("TiTo1111111111111111111111111111111111111");

// Seeds for PDA derivation
export const AGENT_SEED = Buffer.from("agent");

/**
 * Platform claim for cross-platform verification
 */
export interface PlatformClaim {
  platformType: string;  // "discord", "whatsapp", "telegram"
  platformId: string;    // bot ID, phone number, etc.
  proofHash: number[];   // 32-byte hash
  verifiedAt: number;    // Unix timestamp
}

/**
 * Agent identity stored on-chain
 */
export interface AgentIdentity {
  authority: PublicKey;
  name: string;
  emoji: string;
  primaryPlatform: string;
  platforms: PlatformClaim[];
  team: PublicKey | null;
  registeredAt: number;
  bump: number;
}

/**
 * TitoPati SDK - Client for Agent Identity Registry
 */
export class TitoPatiSDK {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey = PROGRAM_ID) {
    this.connection = connection;
    this.programId = programId;
  }

  /**
   * Find PDA for an agent by name
   */
  findAgentPDA(name: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [AGENT_SEED, Buffer.from(name)],
      this.programId
    );
  }

  /**
   * Check if an agent is registered
   */
  async agentExists(name: string): Promise<boolean> {
    const [pda] = this.findAgentPDA(name);
    const account = await this.connection.getAccountInfo(pda);
    return account !== null;
  }

  /**
   * Get agent identity by name
   */
  async getAgent(name: string): Promise<AgentIdentity | null> {
    const [pda] = this.findAgentPDA(name);
    const account = await this.connection.getAccountInfo(pda);
    
    if (!account) return null;
    
    // Decode account data (simplified - full impl would use Anchor's coder)
    // This is a placeholder - real implementation needs IDL
    console.log(`Agent ${name} found at ${pda.toBase58()}`);
    return null; // TODO: Implement full deserialization
  }

  /**
   * Get all registered agents (paginated)
   */
  async getAllAgents(limit: number = 100): Promise<PublicKey[]> {
    const accounts = await this.connection.getProgramAccounts(this.programId, {
      dataSlice: { offset: 0, length: 0 }, // Just get pubkeys
    });
    
    return accounts.slice(0, limit).map(a => a.pubkey);
  }
}

// Convenience exports
export { Connection, PublicKey } from "@solana/web3.js";

// Example usage
/*
import { TitoPatiSDK, Connection } from "@titopati/sdk";

const connection = new Connection("https://api.devnet.solana.com");
const sdk = new TitoPatiSDK(connection);

// Check if Tito is registered
const titoExists = await sdk.agentExists("Tito");
console.log("Tito registered:", titoExists);

// Get Tito's PDA
const [titoPDA] = sdk.findAgentPDA("Tito");
console.log("Tito PDA:", titoPDA.toBase58());
*/
