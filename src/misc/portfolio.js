export const uniqueSymbolCount = portfolio =>
  portfolio.symbols.size

export const purchase = (portfolio, symbol, _shares) => {
  let symbolWithNewSymbolAdded = new Set(portfolio.symbols)
  symbolWithNewSymbolAdded.add(symbol)
  return ({
    ...portfolio,
    symbols: symbolWithNewSymbolAdded
  })
}

export const create = () => ({ symbols: new Set() })

export const isEmpty = portfolio => uniqueSymbolCount(portfolio) === 0
