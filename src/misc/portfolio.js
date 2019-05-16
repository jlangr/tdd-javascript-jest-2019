export const create = () => {
  return {
    symbols: {},
  }
}

export const value = (portfolio, stockPriceLookUpService) => {
  if (isEmpty(portfolio)) return 0

  const symbols  = Object.keys(portfolio.symbols)
  const totalValue = symbols.reduce((result, symbol) =>
    result + stockPriceLookUpService(symbol) * shareCount(portfolio, symbol), 0)
  return totalValue
}

export const isEmpty = portfolio => {
  return uniqueSymbolCount(portfolio) === 0;
}

export const purchase = (portfolio, symbolName, sharesQty) => {
  portfolio.symbols[symbolName] = shareCount(portfolio, symbolName) + sharesQty
  return portfolio
}

export const sell = (portfolio, symbolName, sharesQty) => {
  portfolio.symbols[symbolName] = shareCount(portfolio, symbolName) - sharesQty
  return portfolio
}

export const reCalculateShareCount = (portfolio, symbolName, sharesQty) =>  shareCount(portfolio, symbolName) - sharesQty


export const shareCount = (portfolio, symbolName) => {
  return portfolio.symbols[symbolName] === undefined ? 0 : portfolio.symbols[symbolName]
}

export const uniqueSymbolCount = portfolio => Object.keys(portfolio.symbols).length