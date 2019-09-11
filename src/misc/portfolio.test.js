import * as Portfolio from './portfolio'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => portfolio = Portfolio.create())

  it('is empty when created', () => {
    expect(Portfolio.isEmpty(portfolio))
      .toBe(true)
  })

  it('is not empty after purchase', () => {
    const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    expect(Portfolio.isEmpty(newPortfolio))
      .toBe(false)
  })

  it('has unique symbol count 0 when created', () => {
    expect(Portfolio.symbolCount(portfolio))
      .toEqual(0)
  })

  it('has unique symbol count 1 after purchase', () => {
    const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    expect(Portfolio.symbolCount(newPortfolio))
      .toEqual(1)
  })

  it('increments symbol count each purchase', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)
    newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 1)

    expect(Portfolio.symbolCount(newPortfolio))
      .toEqual(2)
  })

  it('does not increment symbol count on same symbol purchase', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    newPortfolio = Portfolio.purchase(newPortfolio, 'BAYN', 2)

    expect(Portfolio.symbolCount(newPortfolio))
      .toEqual(1)
  })

  it('answers shares for purchased symbol', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)
    newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 100)

    expect(Portfolio.sharesOf(newPortfolio, 'IBM'))
      .toEqual(100)
  })

  it('returns 0 for shares of unpurchased symbol', () => {
    expect(Portfolio.sharesOf(portfolio, 'IBM'))
      .toEqual(0)
  })

  it('accumulates shares for same symbol purchase', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

    newPortfolio = Portfolio.purchase(newPortfolio, 'BAYN', 20)

    expect(Portfolio.sharesOf(newPortfolio, 'BAYN'))
      .toEqual(10 + 20)
  })

  it('reduces shares on sell', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 1)

    expect(Portfolio.sharesOf(newPortfolio, 'BAYN'))
      .toEqual(42 - 1)
  })

  it('reduces count when all shares of symbol sold', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 42)

    expect(Portfolio.symbolCount(newPortfolio, 'BAYN'))
      .toEqual(0)
  })

  it('throws when selling too many', () => {
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    expect(() => Portfolio.sell(
      newPortfolio, 'BAYN', 42 + 1)).toThrow(RangeError)
  })

  it('is worthless when created', () => {
    expect(Portfolio.value(portfolio)).toEqual(0)
  })

  const BAYN_CURRENT_VALUE = 20
  const IBM_CURRENT_VALUE = 200

  it('has value of current price for single share purchase', () => {
    const stubService = () => BAYN_CURRENT_VALUE
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    const value = Portfolio.value(newPortfolio, stubService)

    expect(value).toEqual(BAYN_CURRENT_VALUE)
  })

  it('multiplies shares by price', () => {
    const stubService = () => BAYN_CURRENT_VALUE
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    const value = Portfolio.value(newPortfolio, stubService)

    expect(value).toEqual(BAYN_CURRENT_VALUE * 42)
  })

  it('sums values for all symbols', () => {
    const stubService = symbol =>
      symbol === 'BAYN' ? BAYN_CURRENT_VALUE : IBM_CURRENT_VALUE
    let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 15)

    const value = Portfolio.value(newPortfolio, stubService)

    expect(value).toEqual(
      BAYN_CURRENT_VALUE * 10 + IBM_CURRENT_VALUE * 15)
  })
})