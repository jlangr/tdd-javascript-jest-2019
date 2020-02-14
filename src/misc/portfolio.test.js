import * as Portfolio from './portfolio'
import { when } from 'jest-when'

const BayerCurrentPrice = 21
const AppleCurrentPrice = 2000

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  describe('emptiness... or not', () => {
    it('is empty when no purchases made', () => {
      expect(Portfolio.isEmpty(portfolio)).toBe(true)
    })

    it('is not empty after purchase', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

      expect(Portfolio.isEmpty(newPortfolio)).toBe(false)
    })
  })

  describe('unique symbol count', () => {
    it('is zero when no purchases made', () => {
      expect(Portfolio.uniqueSymbolCount(portfolio)).toBe(0)
    })

    it('is 1 when a single purchase is made', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

      expect(Portfolio.uniqueSymbolCount(newPortfolio)).toBe(1)
    })

    it('is incremented with each new symbol purchase', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 1)

      expect(Portfolio.uniqueSymbolCount(newPortfolio)).toBe(2)
    })

    it('is incremented on multiple purchases different symbol', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)
      newPortfolio = Portfolio.purchase(newPortfolio, 'BAYN', 1)

      expect(Portfolio.uniqueSymbolCount(newPortfolio)).toBe(1)
    })
  })

  describe('shares by symbol', () => {
    it('is returned for single purchase', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(42)
    })

    it('is 0 for symbol not purchased', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'IBM', 42)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(0)
    })

    it('accumulates for multiple purchases same symbol', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'IBM', 42)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 10)

      expect(Portfolio.sharesOf(newPortfolio, 'IBM')).toEqual(52)
    })

    it('returns appropriate shares for given symbol', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'IBM', 42)
      newPortfolio = Portfolio.purchase(newPortfolio, 'BAYN', 10)

      expect(Portfolio.sharesOf(newPortfolio, 'IBM')).toEqual(42)
    })
  })

  describe('selling', () => {
    it('decreases shares by shares sold', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)
      newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 10)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(32)
    })

    it('decrements symbol count when all shares sold', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 22)
      newPortfolio = Portfolio.sell(newPortfolio, 'IBM', 22)

      expect(Portfolio.uniqueSymbolCount(newPortfolio)).toEqual(1)
    })
  })

  describe('potential errors', () => {
    it('throws when selling too many', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 20)

      expect(() => {
        Portfolio.sell(newPortfolio, 'IBM', 20 + 1)
      }).toThrow(RangeError)
    })
  })

  describe('value', () => {
    it('is worthless when created', () => {
      const result = Portfolio.value(portfolio)

      expect(result).toEqual(0)
    })

    it('is worth share price on single purchase 1 share', () => {
      const stockService = () => BayerCurrentPrice
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

      const result = Portfolio.value(newPortfolio, stockService)

      expect(result).toEqual(BayerCurrentPrice)
    })

    it('is worth share price on single purchase 1 share', () => {
      const stockService = () => BayerCurrentPrice
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

      const result = Portfolio.value(newPortfolio, stockService)

      expect(result).toEqual(BayerCurrentPrice * 10)
    })

    it('totals values for all holdings (symbols)', () => {
      const stockService = (symbol) =>
        symbol === 'BAYN' ? BayerCurrentPrice : AppleCurrentPrice

      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
      newPortfolio = Portfolio.purchase(newPortfolio, 'AAPL', 20)

      const result = Portfolio.value(newPortfolio, stockService)
      console.log('result of value is ', result)

      expect(result).toEqual(
        BayerCurrentPrice * 10 + AppleCurrentPrice * 20)
    })

    it('jest mock -- totals values for all holdings (symbols)', () => {
      const stockService = jest.fn()
      when(stockService).calledWith('BAYN').mockReturnValue(BayerCurrentPrice)
      when(stockService).calledWith('AAPL').mockReturnValue(AppleCurrentPrice)

      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
      newPortfolio = Portfolio.purchase(newPortfolio, 'AAPL', 20)

      const result = Portfolio.value(newPortfolio, stockService)

      expect(result).toEqual(
        BayerCurrentPrice * 10 + AppleCurrentPrice * 20)
    })
  })
})