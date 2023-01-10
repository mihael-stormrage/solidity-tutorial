const isAddressesEqual = (addr1?: string, addr2?: string): boolean => {
  if (!addr1 || !addr2) return false;
  return addr1.toUpperCase() === addr2.toUpperCase();
};

export default isAddressesEqual;
