export const purchase = (portfolio, symbol, sharesToBuy) =>
  ({ ...portfolio,
    symbols: { ...portfolio.symbols,
      [symbol]: shares(portfolio, symbol) + sharesToBuy }
  })

const throwWhenSellingTooMany = (portfolio, symbol, sharesToSell) => {
  if (sharesToSell > shares(portfolio, symbol))
    throw new RangeError()
}

const remove = (portfolio, symbol) => {
  const cleanedSymbols = Object.assign({}, portfolio.symbols)
  delete cleanedSymbols[symbol]
  return {...portfolio, symbols: cleanedSymbols}
}

const removeIfEmpty = (portfolio, symbol) => {
  if (shares(portfolio, symbol) > 0) return portfolio
  return remove(portfolio, symbol)
}

export const sell = (portfolio, symbol, sharesToSell) => {
  throwWhenSellingTooMany(portfolio, symbol, sharesToSell)
  const updatedPortfolio = purchase(portfolio, symbol, -sharesToSell)
  return removeIfEmpty(updatedPortfolio, symbol)
}

export const symbolCount = portfolio =>
  Object.keys(portfolio.symbols).length

export const create = () =>
  ({ symbols: {} })

export const isEmpty = portfolio =>
  symbolCount(portfolio) === 0

export const shares = (portfolio, symbol) => {
  if (!portfolio.symbols.hasOwnProperty(symbol))
    return 0
  return portfolio.symbols[symbol]
}
