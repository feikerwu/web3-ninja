import axios from 'axios';

interface QuoteResponse {
  inputAmount: string;
  outputAmount: string;
  // 其他字段...
}

async function getTokenPrice(
  inputMint: string,
  outputMint: string = 'So11111111111111111111111111111111111111112'
): Promise<number | null> {
  const url = 'https://quote-api.jup.ag/v4/quote';

  const params = {
    inputMint,
    outputMint,
    amount: 1000000000, // 1 SOL (考虑到小数点后9位)
    slippageBps: 50,
  };

  try {
    const response = await axios.get<QuoteResponse>(url, { params });

    if (response.status === 200) {
      const data = response.data;
      const inputAmount = parseInt(data.inputAmount);
      const outputAmount = parseInt(data.outputAmount);

      // 计算价格比率
      const priceRatio = outputAmount / inputAmount;
      return priceRatio;
    } else {
      console.error(`Error: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

// 示例使用
async function main() {
  // USDC的mint地址
  const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

  const price = await getTokenPrice(usdcMint);
  if (price !== null) {
    console.log(`1 USDC = ${price.toFixed(6)} SOL`);
    console.log(`1 SOL = ${(1 / price).toFixed(2)} USDC`);
  }
}

main().catch(console.error);
