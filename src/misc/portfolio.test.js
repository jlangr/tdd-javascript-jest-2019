import * as Portfolio from './portfolio'
import * as StockService from './stock-service'
import { when } from 'jest-when'

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

  it('has 0 count when created', () => {
    expect(Portfolio.count(portfolio)).toEqual(0)
  })

  it('increases count on buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 1)

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('increments count with each unique symbol buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
    portfolio = Portfolio.buy(portfolio, 'AAPL', 20)

    expect(Portfolio.count(portfolio)).toEqual(2)
  })

  it('does not increment count with same symbol buy', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
    portfolio = Portfolio.buy(portfolio, 'BAYN', 20)

    expect(Portfolio.count(portfolio)).toEqual(1)
  })

  it('returns shares for symbol purchased', () => {
    portfolio = Portfolio.buy(portfolio, 'IBM', 42)

    expect(Portfolio.sharesOf(portfolio, 'IBM')).toEqual(42)
  })

  it('returns 0 for shares of symbol not purchased', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(0)
  })

  it('accumulates shares on same symbol purchase', () => {
    portfolio = Portfolio.buy(portfolio, 'IBM', 10)
    portfolio = Portfolio.buy(portfolio, 'IBM', 20)

    expect(Portfolio.sharesOf(portfolio, 'IBM')).toEqual(30)
  })

  it('reduces shares on sell', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 10)

    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(32)
  })

  it('reduces count on sell of all shares for symbol', () => {
    portfolio = Portfolio.buy(portfolio, 'BAYN', 42)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 42)

    expect(Portfolio.count(portfolio)).toEqual(0)
  })

  it('throws when selling too many', () => {
    const shares = 10
    portfolio = Portfolio.buy(portfolio, 'BAYN', shares)
    expect(() => {
      portfolio = Portfolio.sell(portfolio, 'BAYN', shares + 1)
    }).toThrow(RangeError)
  })

  describe('value', () => {
    const BayerValue = 19
    const IbmValue = 19
    let stubStockService

    beforeEach(() => {
      stubStockService = jest.fn()
      StockService.injectPriceStub(stubStockService)
    })

    it('is worthless when created', () => {
      expect(Portfolio.value(portfolio)).toEqual(0)
    })

    it('multiplies price by number of shares', () => {
      const stubStockService = () => BayerValue
      portfolio = Portfolio.buy(portfolio, 'BAYN', 10)

      expect(Portfolio.value(portfolio, stubStockService))
        .toEqual(BayerValue * 10)
    })

    it('accumulates values for multiple symbols', () => {
      const stubStockService = jest.fn()
      when(stubStockService).calledWith('BAYN').mockReturnValue(BayerValue)
      when(stubStockService).calledWith('IBM').mockReturnValue(IbmValue)
      portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
      portfolio = Portfolio.buy(portfolio, 'IBM', 20)

      expect(Portfolio.value(portfolio, stubStockService))
        .toEqual(BayerValue * 10 + IbmValue * 20)
    })

    it('accumulates values for multiple symbols inject via import', () => {
      when(stubStockService).calledWith('BAYN').mockReturnValue(BayerValue)
      when(stubStockService).calledWith('IBM').mockReturnValue(IbmValue)

      portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
      portfolio = Portfolio.buy(portfolio, 'IBM', 20)

      expect(Portfolio.value2(portfolio))
        .toEqual(BayerValue * 10 + IbmValue * 20)
    })
  })
})