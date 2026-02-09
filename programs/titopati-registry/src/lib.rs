use anchor_lang::prelude::*;

declare_id!("TiTo1111111111111111111111111111111111111");

#[program]
pub mod titopati_registry {
    use super::*;

    /// Register a new agent identity
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        name: String,
        emoji: String,
        primary_platform: String,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.authority = ctx.accounts.authority.key();
        agent.name = name;
        agent.emoji = emoji;
        agent.primary_platform = primary_platform;
        agent.platforms = vec![];
        agent.team = None;
        agent.registered_at = Clock::get()?.unix_timestamp;
        agent.bump = ctx.bumps.agent;
        
        msg!("Agent registered: {}", agent.name);
        Ok(())
    }

    /// Add a platform claim (Discord, WhatsApp, Telegram, etc.)
    pub fn add_platform(
        ctx: Context<UpdateAgent>,
        platform_type: String,
        platform_id: String,
        proof_hash: [u8; 32],
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        let claim = PlatformClaim {
            platform_type,
            platform_id,
            proof_hash,
            verified_at: Clock::get()?.unix_timestamp,
        };
        
        agent.platforms.push(claim);
        msg!("Platform added to agent: {}", agent.name);
        Ok(())
    }

    /// Join a team
    pub fn join_team(
        ctx: Context<UpdateAgent>,
        team_pubkey: Pubkey,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.team = Some(team_pubkey);
        msg!("Agent {} joined team", agent.name);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct RegisterAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + AgentIdentity::INIT_SPACE,
        seeds = [b"agent", name.as_bytes()],
        bump
    )]
    pub agent: Account<'info, AgentIdentity>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub agent: Account<'info, AgentIdentity>,
    
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct AgentIdentity {
    pub authority: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(8)]
    pub emoji: String,
    #[max_len(32)]
    pub primary_platform: String,
    #[max_len(10)]
    pub platforms: Vec<PlatformClaim>,
    pub team: Option<Pubkey>,
    pub registered_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct PlatformClaim {
    #[max_len(16)]
    pub platform_type: String,  // "discord", "whatsapp", "telegram"
    #[max_len(64)]
    pub platform_id: String,    // bot ID, phone number, etc.
    pub proof_hash: [u8; 32],   // hash of signed message
    pub verified_at: i64,
}
