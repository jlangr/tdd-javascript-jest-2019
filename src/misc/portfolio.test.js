import * as Portfolio from './portfolio'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  it('is empty when created', () => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  it('is not empty after buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 1)

    expect(Portfolio.isEmpty(portfolio)).toBe(false)
  })

  it('has symbol count zero when created', () => {
    expect(Portfolio.symbolCount(portfolio)).toEqual(0)
  })

  it('increases symbol count with each buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

    portfolio = Portfolio.buy(portfolio, 'AAPL', 15)

    expect(Portfolio.symbolCount(portfolio)).toEqual(2)
  })

  it('doesnt increase symbol count on same symbol buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

    portfolio = Portfolio.buy(portfolio, 'BAYN', 15)

    expect(Portfolio.symbolCount(portfolio)).toEqual(1)
  })

  it('returns sharesOf purchased for symbol', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    expect(Portfolio.sharesOf(portfolio, 'BAYN'))
      .toEqual(42)
  })

  it('returns 0 for sharesOf of symbol not purchased', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN'))
      .toEqual(0)
  })

  it('adds sharesOf for multiple purchases same symbol', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 40)
    portfolio = Portfolio.buy(portfolio, 'BAYN', 50)

    expect(Portfolio.sharesOf(portfolio, 'BAYN'))
      .toEqual(90)
  })

  it('reduces shares on sell', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 40)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN'))
      .toEqual(30)
  })

  it('reduces symbol count when selling all shares', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

    portfolio = Portfolio.sell( portfolio, 'BAYN', 10)

    expect(Portfolio.symbolCount(portfolio, 'BAYN'))
      .toEqual(0)
  })

  it('throws when selling too many shares', () => {
    const purchased = 10

    portfolio = Portfolio.buy(portfolio, 'BAYN', purchased)

    expect(() => {
      portfolio = Portfolio.sell(
        portfolio, 'BAYN', purchased + 1)
    }).toThrow(RangeError)

  })
})