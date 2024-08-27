import { MainnetSDK } from './sdk';
import { BN } from 'bn.js';

async function retrievalPositions() {
  const res = await MainnetSDK.Position.getPositionList(
    '0x37ba0e3e03115d69428c1c8be167baefca91c8003ac7f5813acaa236f46893fc'
    // ['0x83c101a55563b037f4cd25e5b326b26ae6537dc8048004c1408079f7578dd160'],
    // false
  );

  const formattedRes = res.map(position => ({
    ...position,
  }));

  console.log('get positions of one pool by owner address', formattedRes);
}

retrievalPositions();
