const conversions = [
  { romanDigit: 'M', arabicDigit: 1000 },
  { romanDigit: 'CM', arabicDigit: 900 },
  { romanDigit: 'D', arabicDigit: 500 },
  { romanDigit: 'CD', arabicDigit: 400 },
  { romanDigit: 'C', arabicDigit: 100 },
  { romanDigit: 'XC', arabicDigit: 90 },
  { romanDigit: 'L', arabicDigit: 50 },
  { romanDigit: 'XL', arabicDigit: 40 },
  { romanDigit: 'X', arabicDigit: 10 },
  { romanDigit: 'IX', arabicDigit: 9 },
  { romanDigit: 'V', arabicDigit: 5 },
  { romanDigit: 'IV', arabicDigit: 4 },
  { romanDigit: 'I', arabicDigit: 1 }
]
export const convert = arabic =>
  conversions.reduce(({ romanResult, arabicRemaining }, { romanDigit, arabicDigit}) => {
    const digitsNeeded = Math.floor(arabicRemaining / arabicDigit)
    return {
      romanResult: romanResult + romanDigit.repeat(digitsNeeded),
      arabicRemaining: arabicRemaining - digitsNeeded * arabicDigit
    }
  }, { romanResult: '', arabicRemaining: arabic }).romanResult
