import * as Portfolio from './Portfolio'

describe('a portfolio', () =>{
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  it('is isEmpty when created', () => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  it('is not isEmpty after purchase', () => {
    const newPortfolio = Portfolio.purchase(portfolio, 'BAYN')

    expect(Portfolio.isEmpty(newPortfolio)).toBe(false)
  })

  it('has count 0 when created', () => {
    expect(Portfolio.count(portfolio)).toEqual(0)
  })

  it('has count 1 after purchase', () => {
    const newPortfolio = Portfolio.purchase(portfolio, 'BAYN')

    expect(Portfolio.count(newPortfolio)).toEqual(1)
  })

  it('increments counts on multiple purchases', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN')
    portfolio = Portfolio.purchase(portfolio, 'IBM')

    expect(Portfolio.count(portfolio)).toEqual(2)
  })

  it('does not increment count on multiple same-symbol purchases', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN')
    portfolio = Portfolio.purchase(portfolio, 'BAYN')

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('returns shares purchased for symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 42)
    portfolio = Portfolio.purchase(portfolio, 'IBM', 20)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(42)
  })

  it('returns 0 for shares of unpurchased symbol', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(0)
  })

  it('accumulates shares purchased for same symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 42)
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 20)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(62)
  })

  it('reduces shares on sell', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    portfolio = Portfolio.sell(portfolio, 'BAYN', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(32)
  })

  it('removes symbol on sell all', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    portfolio = Portfolio.sell(portfolio, 'BAYN', 42)

    expect(Portfolio.isEmpty(portfolio, 'BAYN')).toBe(true)
  })

  it('throws on sell too many', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    expect(() => {
      Portfolio.sell(portfolio, 'BAYN', 42 + 1)
    }).toThrow(RangeError)
  })
})