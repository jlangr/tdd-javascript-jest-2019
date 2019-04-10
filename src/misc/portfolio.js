export const create = () => ({ holdings: {} })

const transact = (portfolio, symbol, shares) =>
  ({
    ...portfolio,
    holdings: {
      ...portfolio.holdings,
      [symbol]: shares + sharesOf(portfolio, symbol)
    }
  })

export const buy = (portfolio, symbol, shares) =>
  transact(portfolio, symbol, shares)

const throwOnOversell = (portfolio, symbol, shares) => {
  if (sharesOf(portfolio, symbol) < shares)
    throw new RangeError()
}

const removeSymbol = (portfolio, symbol) => {
  const updatedHoldings = { ...portfolio.holdings }
  delete updatedHoldings[symbol]
  return { ...portfolio, holdings: updatedHoldings }
}


export const sell = (portfolio, symbol, shares) => {
  throwOnOversell(portfolio, symbol, shares)
  let updatedPortfolio = buy(portfolio, symbol, -1 * shares)
  if (sharesOf(updatedPortfolio, symbol) === 0)
    updatedPortfolio = removeSymbol(updatedPortfolio, symbol)
  return updatedPortfolio
}

export const sharesOf = (portfolio, symbol) => {
  if (isEmpty(portfolio)) return 0

  return portfolio.holdings[symbol]
}

export const isEmpty = portfolio => count(portfolio) === 0

export const count = portfolio =>
  Object.keys(portfolio.holdings).length

