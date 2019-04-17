export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => count(portfolio) === 0

export const count = portfolio => Object.keys(portfolio.holdings).length

export const sharesOf = (portfolio, symbol) =>
  symbol in portfolio.holdings
    ? portfolio.holdings[symbol]
    : 0

const transact = (portfolio, symbol, shares) =>
  ({
    ...portfolio,
    holdings: {
      ...portfolio.holdings,
      [symbol]: shares + sharesOf(portfolio, symbol)}
  })

export const buy = (portfolio, symbol, shares = 1) =>
  transact(portfolio, symbol, shares)

const throwOnOversell = (portfolio, symbol, shares) => {
  if (shares > sharesOf(portfolio, symbol))
    throw new RangeError()
}

export const sell = (portfolio, symbol, shares) => {
  throwOnOversell(portfolio, symbol, shares)
  let updatedPortfolio = transact(portfolio, symbol, -shares)
  updatedPortfolio = removeIfEmpty(updatedPortfolio, symbol)
  return updatedPortfolio
}

const remove = (portfolio, symbol) => {
  const updatedHoldings = {...portfolio.holdings}
  delete updatedHoldings[symbol]
  return {
    ...portfolio,
    holdings: updatedHoldings
  }
}

const removeIfEmpty = (portfolio, symbol) => {
  if (sharesOf(portfolio, symbol) !== 0)
    return portfolio
  return remove(portfolio, symbol)
}
