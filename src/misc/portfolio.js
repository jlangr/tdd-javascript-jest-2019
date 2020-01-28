export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => symbolCount(portfolio) === 0

export const purchase = (portfolio, symbol, shares) =>
  ({
    holdings: {...portfolio.holdings,
      [symbol]: sharesOf(portfolio, symbol) + shares
    }
  })

const removeSymbolIfUnowned = (portfolio, symbol) => {
  if (sharesOf(portfolio, symbol) > 0) return portfolio

  const { [symbol]: _, ...withoutSymbol } = portfolio.holdings
  return { ...portfolio, holdings: withoutSymbol }
}

const throwWhenSellingTooMany = (portfolio, symbol, shares) => {
  if (sharesOf(portfolio, symbol) < shares)
    throw new RangeError()
}

export const sell = (portfolio, symbol, shares) => {
  throwWhenSellingTooMany(portfolio, symbol, shares)
  let newPortfolio = purchase(portfolio, symbol, -shares)
  return removeSymbolIfUnowned(newPortfolio, symbol)
}

export const symbolCount = portfolio => Object.keys(portfolio.holdings).length

export const sharesOf = (portfolio, symbol) =>
  isEmpty(portfolio) ? 0 : portfolio.holdings[symbol]
