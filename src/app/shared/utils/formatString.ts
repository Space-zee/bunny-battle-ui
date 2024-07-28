export const formatAddress = (address: string): string => {
  return address.slice(0, 4) + "..." + address.slice(-3);
};

export const formatString = (str: string): string => {
  return str.slice(0, 4) + "..." + str.slice(-4);
};
