import * as Portfolio from './portfolio'
import { when } from 'jest-when'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => portfolio = Portfolio.create())

  it('is empty when created', () => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  it('is not empty after buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN')

    expect(Portfolio.isEmpty(portfolio)).toBe(false)
  })

  it('has unique count of 0 when created', () =>{
    expect(Portfolio.count(portfolio)).toEqual(0)
  })

  it('has unique count of 1 after buy', () =>{
    portfolio = Portfolio.buy(portfolio, 'BAYN')

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('increments count on buy of unique symbol', () =>{
    portfolio = Portfolio.buy(portfolio, 'BAYN')
    portfolio = Portfolio.buy(portfolio, 'IBM')

    expect(Portfolio.count(portfolio)).toEqual(2)
  })

  it('does not increment count on buy of same symbol', () =>{
    portfolio = Portfolio.buy(portfolio, 'BAYN')
    portfolio = Portfolio.buy(portfolio, 'BAYN')

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('returns shares of symbol', () =>{
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(42)
  })

  it('returns 0 for shares of unpurchased symbol', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(0)
  })

  it('accumulates shares for symbol for multiple purchases', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
    portfolio = Portfolio.buy(portfolio, 'BAYN', 20)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(30)
  })

  it('reduces shares on sell', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 50)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 20)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(30)
  })

  it('reduces count on whole sale of symbol', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 50)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 50)

    expect(Portfolio.count(portfolio)).toEqual(0)
  })

  it('throws on sell of too many shares', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 50)
    expect(() =>
      portfolio = Portfolio.sell(portfolio, 'BAYN', 50 + 1)
    ).toThrow(RangeError)
  })

  describe('portfolio value', () => {
    const BayerPrice = 20
    const IbmPrice = 100

    let stockService = symbol =>
      symbol === 'IBM' ? IbmPrice: BayerPrice

    it('is zero when created', () => {
      expect(Portfolio.value(portfolio, stockService)).toEqual(0)
    })

    it('is share price for single-share purchase', () => {
      portfolio = Portfolio.buy(portfolio, 'BAYN', 1)

      expect(Portfolio.value(portfolio, stockService)).toEqual(BayerPrice)
    })

    it('multiplies # shares by price', () => {
      portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

      expect(Portfolio.value(portfolio, stockService)).toEqual(BayerPrice * 10)
    })

    it('accumulates values for multiple symbols', () => {
      portfolio = Portfolio.buy(portfolio, 'BAYN', 30)
      portfolio = Portfolio.buy(portfolio, 'IBM', 20)

      expect(Portfolio.value(portfolio, stockService))
        .toEqual(BayerPrice * 30
        + IbmPrice * 20)
    })

    it('accumulates values for multiple symbols', () => {
      stockService = jest.fn()
      when(stockService).calledWith('IBM').mockReturnValue(IbmPrice)
      when(stockService).calledWith('BAYN').mockReturnValue(BayerPrice)
      portfolio = Portfolio.buy(portfolio, 'BAYN', 30)
      portfolio = Portfolio.buy(portfolio, 'IBM', 20)

      expect(Portfolio.value(portfolio, stockService))
        .toEqual(BayerPrice * 30
          + IbmPrice * 20)
    })
  })
})