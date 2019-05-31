import Robonomics, { MessageProviderIpfs } from 'robonomics-js';
import { ROBONOMICS } from '../config';

let robonomics = null;
export const initRobonomics = ipfs => {
  robonomics = new Robonomics({
    web3,
    account: {
      address: web3.eth.accounts[0]
    },
    ens: {
      address: ROBONOMICS.ens,
      suffix: ROBONOMICS.ensSuffix,
      version: ROBONOMICS.version
    },
    messageProvider: new MessageProviderIpfs(ipfs),
    lighthouse: ROBONOMICS.lighthouse
  });
  return robonomics;
};
const getRobonomics = () => {
  if (robonomics === null) {
    throw new Error('Robonomics not init');
  }
  return robonomics;
};

export default getRobonomics;
