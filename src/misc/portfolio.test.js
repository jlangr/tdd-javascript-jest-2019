import * as Portfolio from './portfolio'
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

  describe('transaction auditing', () => {
    it('audits on purchase', () => {
      const auditSpy = jest.fn()

      portfolio = Portfolio.buy(portfolio, 'BAYN', 10, auditSpy)

      expect(auditSpy).toHaveBeenCalledWith('purchase 10 BAYN')
    })
  })

  describe('a portfolio\'s value', () => {
    const BayerCurrentValue = 200
    const IbmCurrentValue = 150
    let stubStockService

    beforeEach(() => {
      stubStockService = jest.fn()
    })

    it('is worthless when created', () => {
      expect(Portfolio.value(portfolio)).toEqual(0)
    })

    it('value is symbol price for single share purchase', () => {
      stubStockService.mockReturnValue(BayerCurrentValue)
      portfolio =
        Portfolio.buy(portfolio, 'BAYN', 1)

      expect(Portfolio.value(portfolio, stubStockService))
        .toEqual(BayerCurrentValue)
    })

    it('multiples price by shares', () => {
      stubStockService.mockReturnValue(BayerCurrentValue)
      portfolio =
        Portfolio.buy(
          portfolio, 'BAYN', 10)

      expect(Portfolio.value(portfolio, stubStockService))
        .toEqual(BayerCurrentValue * 10)
    })

    it('accumulates values for all symbols', () => {
      when(stubStockService).calledWith('BAYN').mockReturnValue(BayerCurrentValue)
      when(stubStockService).calledWith('IBM').mockReturnValue(IbmCurrentValue)

      portfolio = Portfolio.buy(portfolio, 'BAYN', 10)
      portfolio = Portfolio.buy(portfolio, 'IBM', 20)

      expect(Portfolio.value(portfolio, stubStockService))
        .toEqual(BayerCurrentValue * 10 + IbmCurrentValue * 20)
    })
  })
})