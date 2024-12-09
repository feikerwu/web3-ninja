async function getPoints() {
  const response = await fetch('https://api.suilend.fi/points/leaderboard');
  const data = await response.json();

  const rows = data.rows;

  const totalPoints = rows.reduce((sum, row) => {
    return sum + parseFloat(row.totalPoints);
  }, 0);

  const usersHasPoints = rows.filter(row => parseFloat(row.totalPoints) > 1);

  console.log(
    `总积分: ${totalPoints.toLocaleString()}, 用户数: ${
      rows.length
    }, 有积分的用户数: ${usersHasPoints.length}`
  );

  return {
    totalPoints,
    users: rows.length,
    usersHasPoints: usersHasPoints.length,
  };
}

const { totalPoints, users, usersHasPoints } = await getPoints();
const myPoints = 0;

const base_mm = 10 ** 8;
const fdvs = [base_mm, base_mm * 2, base_mm * 3, base_mm * 4, base_mm * 5];

const infos = fdvs.map(d => {
  const onePointValue = (d * 0.2) / totalPoints;
  const point = 0.15;

  const info = {
    fdv: d,
    onePointValue,
    uApr: point * onePointValue * 365 * 100,
  };

  console.log(
    `fdv 为 ${d / base_mm}mm: 积分价值为 ${onePointValue.toFixed(
      4
    )}, 1u 给 ${point} 的场景下年化收益为 ${info.uApr.toFixed(
      4
    )}%, 空投价值为 ${myPoints * onePointValue}`
  );

  return info;
});
