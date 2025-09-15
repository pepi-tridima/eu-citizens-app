/**
 * Converts text to uppercase for display
 * @param text - The text to convert to uppercase
 * @returns The uppercase text
 */
export const capitalizeText = (text: string): string => {
  if (!text) return "";

  return text.toUpperCase();
};

/**
 * Converts passport number to uppercase for display
 * @param passportNumber - The passport number to convert to uppercase
 * @returns The uppercase passport number
 */
export const capitalizePassport = (passportNumber: string): string => {
  if (!passportNumber) return "";

  return passportNumber.toUpperCase();
};
