import * as Portfolio from './portfolio'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  it('is empty when no purchases', () => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  it('is not empty after purchases', () => {
    const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

    expect(Portfolio.isEmpty(newPortfolio)).toBe(false)
  })

  describe('count of unique symbols', () => {
    it('is zero when created', () => {
      expect(Portfolio.symbolCount(portfolio)).toEqual(0)
    })

    it('is non-zero after purchase', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

      expect(Portfolio.symbolCount(newPortfolio)).toEqual(1)
    })

    it('increments with multiple purchases different symbols', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 1)

      expect(Portfolio.symbolCount(newPortfolio)).toEqual(2)
    })

    it('does not increment with same-symbol purchase', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)
      newPortfolio = Portfolio.purchase(newPortfolio, 'BAYN', 1)

      expect(Portfolio.symbolCount(newPortfolio)).toEqual(1)
    })

// TODO: eliminate duplication in tests

    it('does not alter passed portfolio on purchase', () => {
      Portfolio.purchase(portfolio, 'BAYN', 1)

      expect(portfolio.uniqueSymbols).toEqual(new Set())
    })
  })
})