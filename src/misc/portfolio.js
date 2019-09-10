import { nasdaqStockLookup } from './NasdaqStockService'

export const value = (portfolio, stockLookupService=nasdaqStockLookup) =>
  Object.entries(portfolio.holdings).reduce(
    (total, [symbol, shares]) => total + stockLookupService(symbol) * shares,
    0)

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => uniqueSymbolCount(portfolio) === 0

export const uniqueSymbolCount = portfolio => Object.keys(portfolio.holdings).length

export const sharesOf = (portfolio, symbol) => {
  if (!(symbol in portfolio.holdings)) return 0
  return portfolio.holdings[symbol]
}

const transact = (portfolio, symbol, shares) => {
  return { ...portfolio,
    holdings: { ...portfolio.holdings,
      [symbol]: shares + sharesOf(portfolio, symbol)}
  }
}

export const buy = (portfolio, symbol, shares) => transact(portfolio, symbol, shares)

export const sell = (portfolio, symbol, shares, auditor=()=>{}) => {
  throwWhenSellingTooMany(portfolio, symbol, shares)
  let updatedPortfolio = transact(portfolio, symbol, -1 * shares)
  updatedPortfolio = removeIfAllSold(updatedPortfolio, symbol)
  auditor(`sold ${symbol}`, shares, Date.now())
  return updatedPortfolio
}

const allSold = (portfolio, symbol) => sharesOf(portfolio, symbol) === 0

const removeIfAllSold = (portfolio, symbol) => {
  if (allSold(portfolio, symbol))
    delete portfolio.holdings[symbol]
  return portfolio
}

const throwWhenSellingTooMany = (portfolio, symbol, shares) => {
  if (shares > sharesOf(portfolio, symbol))
    throw new RangeError()
}