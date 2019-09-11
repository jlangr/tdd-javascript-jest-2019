import * as Util from '../util/jsutil'

export const value = (portfolio, stockService) => {
  if (isEmpty(portfolio))
    return 0

  return Object.entries(portfolio.holdings)
    .reduce((total, [symbol, shares]) =>
      total + stockService(symbol) * shares
    , 0)
}

export const create = () => ({ holdings: {} })

export const isEmpty = portfolio => symbolCount(portfolio) === 0

export const symbolCount = portfolio => Object.keys(portfolio.holdings).length

const wasPurchased = (portfolio, symbol) => symbol in portfolio.holdings

export const sharesOf = (portfolio, symbol) =>
  wasPurchased(portfolio, symbol) ? portfolio.holdings[symbol] : 0

const removeSymbol = (portfolio, symbol) => ({ ...portfolio,
  holdings: Util.removeKey(portfolio.holdings, symbol)})

const throwOnOversell = (portfolio, symbol, shares) => {
  if (shares > sharesOf(portfolio, symbol)) throw new RangeError()}

const transact = (portfolio, symbol, shares) => ({ ...portfolio,
  holdings: { ...portfolio.holdings, [symbol]: shares + sharesOf(portfolio, symbol)}})

const isSellingAll = (portfolio, symbol, shares) => shares === sharesOf(portfolio, symbol)

export const sell = (portfolio, symbol, shares) => {
  throwOnOversell(portfolio, symbol, shares)
  return isSellingAll(portfolio, symbol, shares)
    ? removeSymbol(portfolio, symbol)
    : transact(portfolio, symbol, -shares)
}

export const purchase = (portfolio, symbol, shares) => transact(portfolio, symbol, shares)
