const generateOTP = (length, args) => {
  const {
    digits = true,
    lowerCase = false,
    upperCase = false,
    specialChars = false,
  } = args;

  const numbers = "0123456789";
  const lowerAlphabets = "abcdefghijklmnopqrstuvwxyz";
  const upperAlphabets = lowerAlphabets.toUpperCase();
  const special = "!@#$%*";
  let OTP = "";

  let generateString = "";
  if (digits && lowerCase && upperCase && specialChars) {
    generateString = `${numbers}${lowerAlphabets}${upperAlphabets}${special}`;
  } else if (digits && lowerCase && upperCase) {
    generateString = `${numbers}${lowerAlphabets}${upperAlphabets}`;
  } else if (digits && lowerCase) {
    generateString = `${numbers}${lowerAlphabets}`;
  } else if (digits && upperCase) {
    generateString = `${numbers}${upperAlphabets}`;
  } else if (digits && specialChars) {
    generateString = `${numbers}${special}`;
  } else if (digits) {
    generateString = `${numbers}`;
  } else if (lowerCase && upperCase) {
    generateString = `${lowerAlphabets}${upperAlphabets}`;
  } else if (lowerCase && specialChars) {
    generateString = `${lowerAlphabets}${special}`;
  } else if (upperCase && specialChars) {
    generateString = `${upperAlphabets}${special}`;
  } else if (upperCase) {
    generateString = `${upperAlphabets}`;
  } else if (lowerCase) {
    generateString = `${lowerAlphabets}`;
  } else if (specialChars) {
    generateString = `${special}`;
  }

  for (let i = 0; i < length; i++) {
    OTP += generateString[Math.floor(Math.random() * generateString.length)];
  }

  return OTP;
};

module.exports = generateOTP;
