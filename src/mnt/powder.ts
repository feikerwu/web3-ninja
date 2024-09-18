async function fetchTotalPoints() {
  let totalPoints = 0;
  const headers = {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    priority: 'u=1, i',
    'sec-ch-ua':
      '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    Referer: 'https://meth.mantle.xyz/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  for (let page = 1; page <= 200; page++) {
    const response = await fetch(
      `https://cmeth-api.mantle.xyz/points/leaderboard?page=${page}&take=50`,
      {
        headers,
        method: 'GET',
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch page ${page}`);
      continue;
    }

    const data = await response.json();
    if (data.data && Array.isArray(data.data.data)) {
      totalPoints += data.data.data.reduce(
        (sum, item) => sum + (item.totalPoints || 0),
        0
      );
    }
  }

  console.log(`Total points from all pages: ${totalPoints}`);
  return totalPoints;
}

fetchTotalPoints();
