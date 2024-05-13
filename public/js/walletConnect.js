function solanaWallet() {
  if (window.solana) {
      return true;
  }
  return false;
}

function connectToWallet() {
  if (solanaWallet()) {
      window.solana.connect();
  } else {
    alert("The Solana Wallet Needed!")
  }
}
