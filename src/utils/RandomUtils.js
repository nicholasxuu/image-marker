export const getRandomId = () => (parseInt(Math.random() * 10000000, 10));

export const getRandomColorCode = () => {
  const r = parseInt(Math.random() * 255, 10);
  const g = parseInt(Math.random() * 255, 10);
  const b = parseInt(Math.random() * 255, 10);

  return `#${r}${g}${b}`;
};
