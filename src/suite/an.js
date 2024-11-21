const data = [
  {
    amount: 3632575.61,
    ratio: 0.363258,
    pie: 0.4,
  },
  {
    amount: 2435040.24,
    ratio: 0.24350499999999997,
    pie: 0.34,
  },
  {
    amount: 2400533.7800000007,
    ratio: 0.24005300000000002,
    pie: 0.26,
  },
];

const mapped = data.map(item => ({
  ...item,
  pre: item.pie / item.ratio,
}));

console.log(mapped);
