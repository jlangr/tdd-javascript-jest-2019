export const sharesOf = (portfolio, symbol) =>
  isEmpty(portfolio) ? 0 : portfolio.holdings[symbol]

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => symbolCount(portfolio) === 0

export const purchase = (portfolio, symbol, shares) =>
  ({ holdings: { ...portfolio.holdings, [symbol]: shares } })

export const symbolCount = portfolio => Object.keys(portfolio.holdings).length

export const value = (portfolio, stockLookupService) =>
  // Object.keys(portfolio.holdings).reduce((total, symbol) =>
  //   total + (stockLookupService(symbol) * sharesOf(portfolio, symbol))
  // , 0)
  Object.entries(portfolio.holdings).reduce((total, [symbol, shares]) =>
    total + stockLookupService(symbol) * shares, 0)
