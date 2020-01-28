export const create = () => ({ uniqueSymbols: new Set() })

export const isEmpty = portfolio => symbolCount(portfolio) === 0

export const purchase = (portfolio, symbol) => {
  return ({
    uniqueSymbols: new Set(portfolio.uniqueSymbols).add(symbol)
  })
}

export const symbolCount = portfolio => portfolio.uniqueSymbols.size