import * as StockService from './stock-service'

export const create = () => ({ holdings: {} })

const soldAll = (portfolio, symbol) => sharesOf(portfolio, symbol) === 0

const removeSymbol = (portfolio, symbol) => {
  let holdings = Object.assign({}, portfolio.holdings)
  delete holdings[symbol]
  return {...portfolio, holdings}
}

const throwWhenSellingTooMany = (portfolio, symbol, shares) => {
  if (shares > sharesOf(portfolio, symbol))
    throw new RangeError()
}

export const sell = (portfolio, symbol, shares) => {
  throwWhenSellingTooMany(portfolio, symbol, shares)
  let result = buy(portfolio, symbol, -1 * shares)
  if (soldAll(result, symbol))
    result = removeSymbol(result, symbol)
  return result
}

export const buy = (portfolio, symbol, shares) =>
  ({
    ...portfolio,
    holdings:{
      ...portfolio.holdings,
      [symbol]: shares + sharesOf(portfolio, symbol)
    }
  })

export const isEmpty = portfolio => count(portfolio) === 0

export const count = portfolio =>
  Object.keys(portfolio.holdings).length

export const sharesOf = (portfolio, symbol) => {
  if (!(symbol in portfolio.holdings))
    return 0
  return portfolio.holdings[symbol]
}
export const value2 = (portfolio) =>
  Object.entries(portfolio.holdings)
    .reduce((total, [ symbol, shares ]) =>
      total + StockService.price(symbol) * shares
    , 0)

export const value = (portfolio, priceService=StockService.price) =>
  Object.entries(portfolio.holdings)
    .reduce((total, [ symbol, shares ]) =>
      total + priceService(symbol) * shares
    , 0)
