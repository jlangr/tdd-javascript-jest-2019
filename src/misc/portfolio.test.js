import * as Portfolio from './portfolio'

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
      const newPortfolio = Portfolio.purchase(portfolio, "BAYN", 1)

      expect(Portfolio.isEmpty(newPortfolio)).toBe(false)
    })
  })

  describe('unique symbol count', () => {
    it('is zero when no purchases made', () => {
      expect(Portfolio.uniqueSymbolCount(portfolio)).toBe(0)
    })

    it('is 1 when a purchase is made', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

      expect(Portfolio.uniqueSymbolCount(newPortfolio)).toBe(1)
    })

    it('is incremented on multiple purchases different symbol', () => {
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

})