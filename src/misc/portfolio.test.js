import { when } from 'jest-when'
import * as Portfolio from './Portfolio'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  it('is empty when created', () => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  it('is not empty after buy', () => {
    const newPortfolio = Portfolio.buy(portfolio, 'BAYN', 1)

    expect(Portfolio.isEmpty(newPortfolio)).toBe(false)
  })

  it('has unique count of zero when created', () => {
    expect(Portfolio.uniqueSymbolCount(portfolio)).toEqual(0)
  })

  it('sets count to 1 after purchase', () => {
    const newPortfolio = Portfolio.buy(portfolio, 'BAYN', 1)

    expect(Portfolio.uniqueSymbolCount(newPortfolio)).toEqual(1)
  })

  it('increases symbol count with new symbol purchase', () => {
    let newPortfolio = Portfolio.buy(portfolio, 'BAYN', 1)

    newPortfolio = Portfolio.buy(newPortfolio, 'IBM', 1)

    expect(Portfolio.uniqueSymbolCount(newPortfolio)).toEqual(2)
  })

  it('does not increase symbol count with same symbol purchase', () => {
    let newPortfolio = Portfolio.buy(portfolio, 'BAYN', 1)

    newPortfolio = Portfolio.buy(newPortfolio, 'BAYN', 1)

    expect(Portfolio.uniqueSymbolCount(newPortfolio)).toEqual(1)
  })

  it('answers shares purchased for symbol', () => {
    let newPortfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    newPortfolio = Portfolio.buy(newPortfolio, 'IBM', 100)

    expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(42)
  })

  it('returns 0 for shares of symbol not purchased', () => {
    expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(0)
  })

  it('accumulates shares for same-symbol purchase', () => {
    let newPortfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    newPortfolio = Portfolio.buy(newPortfolio, 'BAYN', 42)

    expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(84)
  })

  it('reduces shares on sell', () => {
    let newPortfolio = Portfolio.buy(portfolio, 'BAYN', 50)

    newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 20)

    expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(30)
  })

  it('reduces symbol count on sell-all', () => {
    let newPortfolio = Portfolio.buy(portfolio, 'BAYN', 42)

    newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 42)

    expect(Portfolio.uniqueSymbolCount(newPortfolio)).toEqual(0)
  })

  it('throws when selling too many', () => {
    expect(() => {
      Portfolio.sell(portfolio, 'BAYN', 1)
    }).toThrow(RangeError)
  })
  
  describe('portfolio value', () => {
    const ValueOfSymbolBayn = 16
    const ValueOfSymbolApple = 150
    let service

    beforeEach(() => {
      service = jest.fn()
    })

    it('is 0 when nothing purchased', () => {
      expect(Portfolio.value(portfolio)).toEqual(0)
    })

    it('is worth symbol price for single-share purchase', () => {
      when(service).calledWith('AAPL').mockReturnValue(ValueOfSymbolApple)

      let newPortfolio = Portfolio.buy(portfolio, 'AAPL', 1)

      expect(Portfolio.value(newPortfolio, service)).toEqual(ValueOfSymbolApple)
    })

    it('accumulates symbol prices for purchases', () => {
      when(service).calledWith('BAYN').mockReturnValue(ValueOfSymbolBayn)
      when(service).calledWith('AAPL').mockReturnValue(ValueOfSymbolApple)

      let newPortfolio = Portfolio.buy(portfolio, 'AAPL', 10)
      newPortfolio = Portfolio.buy(newPortfolio, 'BAYN', 1)
      // service('BAYN')

      expect(Portfolio.value(newPortfolio, service))
        .toEqual(10 * ValueOfSymbolApple + ValueOfSymbolBayn)
    })
    
    describe('audits purchases', () => {
      it('captures a message on a sell', () => {
        const auditSpy = jest.fn()
        let newPortfolio = Portfolio.buy(portfolio, 'AAPL', 20)

        Portfolio.sell(newPortfolio, 'AAPL', 5, auditSpy)

        expect(auditSpy).toHaveBeenCalledWith(`sold AAPL`, 5, expect.any(Number))
      })
      
    })

  })
})