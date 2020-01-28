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

      // expect(portfolio.holdings).toEqual({})
      expect(Portfolio.isEmpty(portfolio)).toBe(true)
    })
  })

  describe('share count', () => {
    it('represents shares purchased', () => {
      const newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 50)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(50)
    })

    it('is zero when never purchased', () => {
      expect(Portfolio.sharesOf(Portfolio.create(), 'BAYN'))
        .toEqual(0)
    })

    it('differs by symbol', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
      newPortfolio = Portfolio.purchase(newPortfolio, 'IBM', 5)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(10)
    })

    it('accumulates on multiple purchases', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 20)
      newPortfolio = Portfolio.purchase(newPortfolio, 'BAYN', 22)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(42)
    })
  })

  describe('when selling', () => {
    it('reduces share count', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 20)

      newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 3)

      expect(Portfolio.sharesOf(newPortfolio, 'BAYN')).toEqual(17)
    })

    it('results in empty portfolio when selling everything', () => {
      let newPortfolio = Portfolio.purchase(portfolio, 'BAYN', 5)

      newPortfolio = Portfolio.sell(newPortfolio, 'BAYN', 5)

      expect(Portfolio.isEmpty(newPortfolio)).toBe(true)
    })

    it('throws when selling too many', () => {
      expect(() => Portfolio.sell(portfolio, 'BAYN', 1)).toThrow(RangeError)
    })
  })
})