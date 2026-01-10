/**
 * Ensures currency values are always numbers
 */
export const normalizeAmount = (value) => {
  if (!value || isNaN(value)) return 0;
  return Number(value);
};
