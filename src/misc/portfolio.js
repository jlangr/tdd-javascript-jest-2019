import * as StockService from './stock-service'

export const value = (portfolio, priceService=StockService.price) =>
  Object.keys(portfolio.holdings).reduce((total, symbol) =>
    total + priceService(symbol) * sharesOf(portfolio, symbol),
  0)

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio =>
  symbolCount(portfolio) === 0

export const symbolCount = portfolio =>
  Object.keys(portfolio.holdings).length

export const buy = (portfolio, symbol, shares, auditor=()=>{}) => {
  const holdings =
    Object.assign({}, portfolio.holdings)
  holdings[symbol] = shares + sharesOf(portfolio, symbol)
  auditor(`purchase ${shares} ${symbol}`)
  return { ...portfolio, holdings }
}

const throwWhenSellingTooMany = (portfolio, symbol, shares) => {
  if (sharesOf(portfolio, symbol) < shares)
    throw new RangeError("error")
}

export const sell = (portfolio, symbol, shares) => {
  throwWhenSellingTooMany(portfolio, symbol, shares)
  const newPortfolio = buy(portfolio, symbol, -shares)
  if (sharesOf(newPortfolio, symbol) === 0)
    delete newPortfolio.holdings[symbol]
  return newPortfolio
}

export const sharesOf = (portfolio, symbol) => {
  if (!(symbol in portfolio.holdings))
    return 0
  return portfolio.holdings[symbol]
}
