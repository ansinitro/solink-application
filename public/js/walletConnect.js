// public/js/walletConnect.js

async function connectToWallet() {
  try {
      // Check if Phantom wallet is installed
      if (window.solana && window.solana.isPhantom) {
          const resp = await window.solana.connect();
          console.log('Connected with public key:', resp.publicKey.toString());

          // Simulate fetching user data from the wallet
          const userData = {
              username: "User123", // This would typically come from the wallet or user input
              avatar: "public/images/avatars/default.png" // Default avatar
          };

          // Store user data in session storage
          sessionStorage.setItem("userData", JSON.stringify(userData));

          // Redirect to registration page
          window.location.href = "/register";
      } else {
          alert("Phantom wallet is not installed. Please install it to continue.");
      }
  } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("An error occurred while connecting to the wallet. Please try again.");
  }
}
