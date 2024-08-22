export const isEnoughBalanceForFee = (
  bet: string,
  estimatedFee: string,
  balance: string,
) => Number(estimatedFee) + Number(bet) <= Number(balance);

export const getBalanceDeficitForFee = (
  bet: string,
  estimatedFee: string,
  balance: string,
) => Number(estimatedFee) + Number(bet) - Number(balance);
