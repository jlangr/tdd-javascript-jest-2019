export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => count(portfolio) === 0

export const count = portfolio => Object.keys(portfolio.holdings).length

export const sharesOf = (portfolio, symbol) =>
  (symbol in portfolio.holdings)
    ? portfolio.holdings[symbol]
    : 0

const transact = (portfolio, symbol, shares) =>
  ({ ...portfolio,
    holdings: { ...portfolio.holdings,
      [symbol]: sharesOf(portfolio, symbol) + shares
    }
  })

const areAllSharesSold = (portfolio, symbol) =>
  sharesOf(portfolio, symbol) === 0

const removeSymbolIfAllSold = (portfolio, symbol) => {
  if (!areAllSharesSold(portfolio, symbol)) return portfolio

  let holdings = Object.assign({}, portfolio.holdings)
  delete holdings[symbol]
  return { ...portfolio, holdings }
}

const throwOnSellTooMany = (portfolio, symbol, shares) => {
  if (shares > sharesOf(portfolio, symbol))
    throw new RangeError()
}

export const sell = (portfolio, symbol, shares) => {
  throwOnSellTooMany(portfolio, symbol, shares)
  const newPortfolio = transact(portfolio, symbol, -shares)
  return removeSymbolIfAllSold(newPortfolio, symbol)
}

export const purchase = (portfolio, symbol, shares) =>
  transact(portfolio, symbol, shares)
