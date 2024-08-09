// import fetch from 'node-fetch';
// 定义API响应的接口
interface CoinGeckoResponse {
  solana: {
    usd: number;
  };
}

const tokenId = `solana`;
const API_URL: string = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;

async function getSolanaPrice(): Promise<number | null> {
  try {
    const response: Response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CoinGeckoResponse = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error('获取Solana价格时出错:', error);
    return null;
  }
}

function updatePrice(): void {
  getSolanaPrice().then((price: number | null) => {
    if (price !== null) {
      console.log(`Solana当前价格: $${price}`);
      // 如果你想在网页上显示价格，可以使用下面的代码
      // const priceElement: HTMLElement | null = document.getElementById('solana-price');
      // if (priceElement) {
      //     priceElement.textContent = `$${price}`;
      // }
    }
  });
}

// 立即更新一次价格
updatePrice();

// 每60秒更新一次价格
setInterval(updatePrice, 60000);

// 注意：在实际使用中，你可能需要调整更新频率以符合API的使用限制
