import { ethers } from 'ethers';

function getAddressFromMnemonic(mnemonic: string): string {
  try {
    const wallet = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(mnemonic)
    );
    return wallet.address;
  } catch (error) {
    console.error('Error generating address from mnemonic:', error);
    return '';
  }
}

// Example usage
const exampleMnemonic = '';
const address = getAddressFromMnemonic(exampleMnemonic);
console.log('Generated address:', address);
