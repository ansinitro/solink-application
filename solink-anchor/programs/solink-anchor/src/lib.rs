/// Include libraries for program
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};
use std::mem::size_of;

// Declare program ID
declare_id!("AXEyVPMFZF27CidxsEo66SnCxqatTAaFZSzqKkfMknFG");

const TEXT_LENGTH: usize = 1024; // Post and comment text length
const USER_NAME_LENGTH: usize = 100; // Username length
const USER_URL_LENGTH: usize = 255; // User profile image url length

#[program]
pub mod solink_anchor {
    use super::*;

    pub fn create_state(ctx: Context<CreateState>) -> Result<()> {
        let state = &mut ctx.accounts.state; // Get state from context
        state.authority = ctx.accounts.authority.key(); // Save authority to state
        state.post_count = 0; // Set post count as 0 when initializing
        Ok(())
    }

    /// Create post
    /// @param text: text of post
    /// @param poster_name: name of post creator
    /// @param poster_url: url of post creator avatar
    pub fn create_post(ctx: Context<CreatePost>, text: String, poster_name: String, poster_url: String) -> Result<()> {
        let state = &mut ctx.accounts.state; // Get State
        let post = &mut ctx.accounts.post; // Get post
        post.authority = ctx.accounts.authority.key(); // Set authority
        post.text = text; // Set text
        post.poster_name = poster_name; // Set poster name
        post.poster_url = poster_url; // Set poster avatar url
        post.comment_count = 0; // Set comment count as 0
        post.index = state.post_count; // Set post index as state's post count
        post.post_time = ctx.accounts.clock.unix_timestamp; // Set post time
        state.post_count += 1; // Increase state's post count by 1
        Ok(())
    }

    /// Create comment for post
    /// @param text: text of comment
    /// @param commenter_name: name of comment creator
    /// @param commenter_url: url of comment creator avatar
    pub fn create_comment(ctx: Context<CreateComment>, text: String, commenter_name: String, commenter_url: String) -> Result<()> {
        let post = &mut ctx.accounts.post; // Get post
        let comment = &mut ctx.accounts.comment; // Get comment
        comment.authority = ctx.accounts.authority.key(); // Set authority to comment
        comment.text = text; // Set comment text
        comment.commenter_name = commenter_name; // Set commenter name
        comment.commenter_url = commenter_url; // Set commenter url
        comment.index = post.comment_count; // Set comment index to post's comment count
        comment.post_time = ctx.accounts.clock.unix_timestamp; // Set post time
        post.comment_count += 1; // Increase post's comment count by 1
        Ok(())
    }
}

/// Contexts
/// CreateState context
#[derive(Accounts)]
pub struct CreateState<'info> {
    #[account(
        init,
        seeds = [b"state".as_ref()],
        bump,
        payer = authority,
        space = size_of::<StateAccount>() + 8
    )]
    pub state: Account<'info, StateAccount>, // Authenticating state account
    #[account(mut)]
    pub authority: Signer<'info>, // Authority (this is signer who paid transaction fee)
    pub system_program: SystemAccount<'info>, // System program (using SystemAccount for safety)
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>, // Token program
}

/// CreatePost context
#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(mut, seeds = [b"state".as_ref()], bump)]
    pub state: Account<'info, StateAccount>, // Authenticate state account
    #[account(
        init,
        // Post account use string "post"
    // and index of post as seeds
    seeds = [b"post".as_ref(), state.post_count.to_be_bytes().as_ref()],
    bump,
    payer = authority,
    space = size_of::<PostAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + USER_URL_LENGTH
    )]
    pub post: Account<'info, PostAccount>, // Authenticate post account
    #[account(mut)]
    pub authority: Signer<'info>, // Authority (this is signer who paid transaction fee)
    pub system_program: SystemAccount<'info>, // System program (using SystemAccount for safety)
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>, // Token program
    pub clock: Sysvar<'info, Clock>, // Clock to save time
}

/// CreateComment context
#[derive(Accounts)]
pub struct CreateComment<'info> {
    #[account(mut, seeds = [b"post".as_ref(), post.index.to_be_bytes().as_ref()], bump)]
    pub post: Account<'info, PostAccount>, // Authenticate post account
    #[account(
        init,
        // Comment account use string "comment", index of post and index of comment per post as seeds
        seeds = [b"comment".as_ref(), post.index.to_be_bytes().as_ref(), post.comment_count.to_be_bytes().as_ref()],
        bump,
        payer = authority,
        space = size_of::<CommentAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + USER_URL_LENGTH
    )]
    pub comment: Account<'info, CommentAccount>, // Authenticate comment account
    #[account(mut)]
    pub authority: Signer<'info>, // Authority (this is signer who paid transaction fee)
    pub system_program: SystemAccount<'info>, // System program (using SystemAccount for safety)
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>, // Token program
    pub clock: Sysvar<'info, Clock>, // Clock to save time
}

// State Account Structure
#[account]
pub struct StateAccount {
    pub authority: Pubkey, // Signer address
    pub post_count: u64, // Post count
}

// Post Account Structure
#[account]
pub struct PostAccount {
    pub authority: Pubkey, // Signer address
    pub text: String, // Post text
    pub poster_name: String, // Post creator name
    pub poster_url: String, // Post creator url
    pub comment_count: u64, // Comment counts of post
    pub index: u64, // Post index
    pub post_time: i64, // Post time
}

// Comment Account Structure
#[account]
pub struct CommentAccount {
    pub authority: Pubkey, // Signer address
    pub text: String, // Comment text
    pub commenter_name: String, // commenter_name
    pub commenter_url: String, // commenter_url
    pub index: u64, // Comment index
    pub post_time: i64, // Post time
}
