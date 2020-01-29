export const sharesOf = (portfolio, symbol) =>
  isEmpty(portfolio) ? 0 : portfolio.holdings[symbol]

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => symbolCount(portfolio) === 0

export const purchase = (portfolio, symbol, shares) => {
  return ({
    holdings: { ...portfolio.holdings, [symbol]: shares }
  })
}

export const symbolCount = portfolio => Object.keys(portfolio.holdings).length

export const value = (portfolio, stockLookupService) => {
  if (isEmpty(portfolio)) return 0

  return stockLookupService()
}