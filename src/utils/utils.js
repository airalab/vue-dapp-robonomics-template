export const toWei = (price, decimals) => {
  const priceNum = new web3.BigNumber(price);
  return priceNum.shift(decimals).toNumber();
};
export const fromWei = (price, decimals) => {
  const priceNum = new web3.BigNumber(price);
  return priceNum.shift(-decimals).toNumber();
};
