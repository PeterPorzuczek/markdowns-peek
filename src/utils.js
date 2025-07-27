// markdowns-peek utilities

export const generateRandomChars = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateDefaultPrefix = () => {
  return `${generateRandomChars(8)}-lib-mp-`;
}; 