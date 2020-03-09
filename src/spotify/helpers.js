export const getRandomNumber = upTo => Math.floor(Math.random() * upTo);
export const getRandomNumberExcluding = (indexesToExclude, upTo) => {
  const n = getRandomNumber(upTo);

  if (indexesToExclude.includes(n)) {
    return getRandomNumberExcluding(indexesToExclude, upTo);
  }
  return n;
};
