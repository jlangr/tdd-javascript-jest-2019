export const value = (portfolio, service) => {
  /*
  portfolio.holdings:
  { bayn: 10, aapl: 20 }
   */

  let total = 0
  Object.keys(portfolio.holdings).forEach(symbol => {
    total += service(symbol) * sharesOf(portfolio, symbol)
  })
  return total
}

// service --> emulating a real service that takes on
// one symbol at a time, e.g. 'BAYN'.

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => uniqueSymbolCount(portfolio) === 0

export const uniqueSymbolCount = portfolio =>
  Object.keys(portfolio.holdings).length

export const sharesOf = (portfolio, symbol) =>
  symbol in portfolio.holdings
    ? portfolio.holdings[symbol]
    : 0

export const purchase = (portfolio, symbol, shares) =>
  transact(portfolio, symbol, shares)

export const sell = (portfolio, symbol, shares) => {
  throwWhenSellingTooMany(portfolio, symbol, shares)
  const newPortfolio = transact(portfolio, symbol, -shares)
  return removeSymbolIfAllSold(newPortfolio, symbol)
}

export const transact = (portfolio, symbol, shares) =>
  ({
    ...portfolio,
    holdings: {
      ...portfolio.holdings, [symbol]: sharesOf(portfolio, symbol) + shares
    }
  })

const throwWhenSellingTooMany = (portfolio, symbol, shares) => {
  if (shares > sharesOf(portfolio, symbol)) throw new RangeError()
}

const removeSymbolIfAllSold = (portfolio, soldSymbol) => {
  if (sharesOf(portfolio, soldSymbol) > 0) return portfolio

  let newHoldings = { ...portfolio.holdings }
  delete newHoldings[soldSymbol]
  return { ...portfolio, holdings: newHoldings }
}
