use anchor_lang::prelude::*;

declare_id!("HmxB2ZgcuM35MhP7JELUX6yQtcCbEkiMHTL83QU58uLP");

#[program]
pub mod nft_mint {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
