export const formatAddress = (address: string): string => {
  return address.slice(0, 4) + "..." + address.slice(-3);
};

export const formatString = (str: string): string => {
  return str.slice(0, 4) + "..." + str.slice(-4);
};

export const formatBalance = (balance: number): string => {
  if (balance === 0) {
    return "0.0";
  }
  if (balance < 0.0001) {
    return balance.toFixed(4);
  }
  const formatted = balance.toFixed(4);
  return formatted.replace(/\.?0+$/, "");
};

export const formatValue = (value: string, fixed: number = 2): string => {
  return Number(value).toFixed(fixed);
};
