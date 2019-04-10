import * as Portfolio from './portfolio'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => portfolio = Portfolio.create())

  it('is empty when created', () => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  it('is not empty after buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

    expect(Portfolio.isEmpty(portfolio)).toBe(false)
  })

  it('has symbol count 0 when created', () => {
    expect(Portfolio.count(portfolio)).toEqual(0)
  })

  it('increases symbol count after buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('increments symbol count after buy different symbol', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
    portfolio = Portfolio.buy(portfolio, 'IBM', 20)

    expect(Portfolio.count(portfolio)).toEqual(2)
  })

  it('does not increase symbol count on same symbol buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
    portfolio = Portfolio.buy(portfolio, 'BAYN', 20)

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('returns shares of symbols purchased', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(42)
  })

  it('returns 0 for shares of unpurchased symbol', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(0)
  })

  it('accumulates shares for same symbols buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(52)
  })

  // already passes! Confidence?
  it('separates shares by symbol', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)
    portfolio = Portfolio.buy(portfolio, 'IBM', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(42)
  })

  it('sells shares', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    portfolio = Portfolio.sell(portfolio, 'BAYN', 20)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(22)
  })

  it('throws when selling too many', () => {
    const boughtShares = 42
    portfolio = Portfolio.buy(portfolio, 'BAYN', boughtShares)

    expect(
      () => Portfolio.sell(portfolio, 'BAYN', boughtShares + 1))

      .toThrow(RangeError)
  })

  it('reduces count when selling all symbol shares', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    portfolio = Portfolio.sell(portfolio, 'BAYN', 42)

    expect(Portfolio.count(portfolio)).toEqual(0)
  })
})