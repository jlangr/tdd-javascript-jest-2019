const romanArray = {1: 'I', 2:'II', 3:'III', 4 : 'IV', 5 : 'V', 9: 'IX' ,10: 'X', 40: 'XL', 50 : 'L', 90: 'XC', 100: 'C', 400 : 'CD', 500: 'D', 900: 'CM', 1000: 'M'}
export const convert = (number)=>{
  let roman = getRoman(number)
  if(roman == undefined){
    let base = getBase(number)
    let remainder = number % base;
    let quotient = Math.floor(number / base);

    for(let i=0;i<quotient;i++){
      if(roman == undefined){
        roman =  getRoman(base)
      }else {
        roman = roman + getRoman(base)
      }

    }
    if(remainder>0){
      roman = roman + convert(remainder)
    }
  }
  console.log(`Number: ${number} Roman: ${roman}`)
  return roman
}

function getBase(number) {
  let base
  let lastIndex = 1
  for (const [key, value] of Object.entries(romanArray)) {
    base = lastIndex
    if(number >= lastIndex &&  number < key){
      break;
    }else{
      lastIndex = key
      base = lastIndex
    }
  }
  return base;
}

function getRoman(number) {
  let roman = (number==2) ? 'II': (number==3)? 'III':undefined
  for (const [key, value] of Object.entries(romanArray)) {
    if(number == key){
      roman = value
      break;
    }
  }
  return roman;
}
