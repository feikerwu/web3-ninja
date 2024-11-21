import { Jupiter } from '@jup-ag/core';
import { Connection, PublicKey } from '@solana/web3.js';

async function getTokenPrice(tokenMint: string) {
  // Initialize connection to Solana mainnet
  const connection = new Connection(
    'https://api.mainnet-beta.solana.com',
    'confirmed'
  );

  // Initialize Jupiter
  const jupiter = await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
  });

  try {
    // USDC mint address (quote token)
    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    // Get routes for swapping 1 token to USDC
    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(tokenMint),
      outputMint: usdcMint,
      amount: 1_000_000_000, // 1 token with 9 decimals
      slippageBps: 50, // 0.5% slippage
    });

    if (routes.routesInfos.length > 0) {
      // Get the best route
      const bestRoute = routes.routesInfos[0];

      // Calculate price in USDC
      const outAmount = Number(bestRoute.outAmount);
      const price = outAmount / 1_000_000; // USDC has 6 decimals

      console.log(`Price for ${tokenMint}: $${price.toFixed(6)} USDC`);
      return price;
    } else {
      console.log('No routes found for this token pair');
      return null;
    }
  } catch (error) {
    console.error('Error getting token price:', error);
    return null;
  }
}

// Example usage:
// const tokenMint = 'YOUR_MEME_TOKEN_MINT_ADDRESS';
// getTokenPrice(tokenMint);
