const anchor = require('@project-serum/anchor');
const { PublicKey, SystemProgram } = require('@solana/web3.js');
const {idl} = require('./idl.js'); // Ensure you have the IDL file in the same directory

const programID = new PublicKey('AXEyVPMFZF27CidxsEo66SnCxqatTAaFZSzqKkfMknFG');
const opts = {
  preflightCommitment: 'processed',
};

const main = async () => {
  // Connect to the wallet
  const wallet = anchor.Wallet.local(); // Use local wallet for simplicity. Replace with your wallet provider.
  
  // Connect to the Solana devnet
  const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), opts.preflightCommitment);
  
  // Create the provider and program
  const provider = new anchor.AnchorProvider(connection, wallet, opts);
  anchor.setProvider(provider);
  const program = new anchor.Program(idl, programID, provider);
  
  // Create state
  const createState = async () => {
    const [statePDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from('state')],
      programID
    );
    
    try {
      await program.rpc.createState({
        accounts: {
          state: statePDA,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        },
      });
      console.log('State created successfully');
    } catch (error) {
      console.error('Error creating state:', error);
    }
  };
  
  // Create post
  const createPost = async (text, posterName, posterUrl) => {
    const [statePDA] = await PublicKey.findProgramAddress(
      [Buffer.from('state')],
      programID
    );
    const stateAccount = await program.account.stateAccount.fetch(statePDA);
    const postCount = stateAccount.postCount.toNumber();
    
    const [postPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from('post'), Buffer.from([postCount])],
      programID
    );
    
    try {
      await program.rpc.createPost(text, posterName, posterUrl, {
        accounts: {
          state: statePDA,
          post: postPDA,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
      });
      console.log('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
  // Create comment
  const createComment = async (postIndex, text, commenterName, commenterUrl) => {
    const [postPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('post'), Buffer.from([postIndex])],
      programID
    );
    const postAccount = await program.account.postAccount.fetch(postPDA);
    const commentCount = postAccount.commentCount.toNumber();
    
    const [commentPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from('comment'), Buffer.from([postIndex]), Buffer.from([commentCount])],
      programID
    );
    
    try {
      await program.rpc.createComment(text, commenterName, commenterUrl, {
        accounts: {
          post: postPDA,
          comment: commentPDA,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
      });
      console.log('Comment created successfully');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  
  // Execute the functions
  await createState();
  await createPost('Hello World', 'Alice', 'https://example.com/alice.jpg');
  await createComment(0, 'Nice post!', 'Bob', 'https://example.com/bob.jpg');
};

// Run the main function
main().catch(err => {
  console.error(err);
});
