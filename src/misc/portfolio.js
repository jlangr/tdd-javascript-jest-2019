export const create = () => {
  return {
    symbols: {},
  }
}

export const value = (portfolio, stockLookupService) =>
  Object.entries(portfolio.symbols).reduce((total, [symbol, shares]) =>
    total + stockLookupService(symbol) * shares
  , 0)

export const isEmpty = portfolio => {
  return uniqueSymbolCount(portfolio) === 0;
}

export const purchase = (portfolio, symbolName, sharesQty) => {
  portfolio.symbols[symbolName] = shareCount(portfolio, symbolName) + sharesQty
  return portfolio
}

export const shareCount = (portfolio, symbolName) => {
  return portfolio.symbols[symbolName] === undefined ? 0 : portfolio.symbols[symbolName]
}

export const uniqueSymbolCount = portfolio => Object.keys(portfolio.symbols).length