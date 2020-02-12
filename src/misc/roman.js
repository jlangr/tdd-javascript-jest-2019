const conversions = [
  { arabicDigit: 1000, romanDigit: 'M' },
  { arabicDigit: 900, romanDigit: 'CM' },
  { arabicDigit: 500, romanDigit: 'D' },
  { arabicDigit: 400, romanDigit: 'CD' },
  { arabicDigit: 100, romanDigit: 'C' },
  { arabicDigit: 90, romanDigit: 'XC' },
  { arabicDigit: 50, romanDigit: 'L' },
  { arabicDigit: 40, romanDigit: 'XL' },
  { arabicDigit: 10, romanDigit: 'X' },
  { arabicDigit: 9, romanDigit: 'IX' },
  { arabicDigit: 5, romanDigit: 'V' },
  { arabicDigit: 4, romanDigit: 'IV' },
  { arabicDigit: 1, romanDigit: 'I' }
]

export const convert = arabic =>
  conversions.reduce(({ s, remaining }, { arabicDigit, romanDigit }) => {
    const digitsToRepeat = Math.floor(remaining / arabicDigit)
    return {
      s: s + romanDigit.repeat(digitsToRepeat),
      remaining: remaining - digitsToRepeat * arabicDigit
    }
  }, { s: '', remaining: arabic }).s
