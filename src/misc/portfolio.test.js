import * as Portfolio from './portfolio'

describe('a portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = Portfolio.create()
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
  })

  afterEach(() => {
    expect(Portfolio.isEmpty(portfolio)).toBe(true)
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
  })

  describe('share count', () => {
    it('answers same as purchased for symbol', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(42)
    })

    it('answers zero for symbol never purchased', () => {
      expect(Portfolio.sharesOf(portfolio, 'BAYN')).toEqual(0)
    })

    it('answers appropriate shares by symbol', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 42)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 14)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(42)
    })
  })

  describe('value', () => {
    it('is worthless when empty', () => {
      expect(Portfolio.value(portfolio)).toEqual(0)
    })

    const BayerCurrentValue = 20.69
    const IbmCurrentValue = 100

    const stockLookupService = symbol =>
      symbol === 'BAYN' ? BayerCurrentValue : IbmCurrentValue

    it('is worth share price for single-share purchase', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 1)

      const value = Portfolio.value(newPortfolio, stockLookupService)

      expect(value).toEqual(BayerCurrentValue)
    })

    it('multiples price by share count', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

      const value = Portfolio.value(newPortfolio, stockLookupService)

      expect(value).toEqual(BayerCurrentValue * 10)
    })

    it('accumulates values for all symbols', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 20)

      const value = Portfolio.value(newPortfolio, stockLookupService)

      expect(value).toEqual(
        IbmCurrentValue * 20 +
        BayerCurrentValue * 10 )
    })
  })
})