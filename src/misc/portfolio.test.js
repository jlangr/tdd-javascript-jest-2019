import * as Portfolio from './portfolio'

describe('a stock portfolio', () => {
  let portfolio;

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  describe('portfolio value', () => {
    describe('when empty', () => {
      it('is zero', () =>
        expect(Portfolio.value(portfolio)).toEqual(0) )
    })

    const BayerValue = 16
    const IbmValue = 100
    const stubService = symbol => symbol === 'IBM' ? IbmValue: BayerValue

    describe('on single share purchase', () => {
      beforeEach(() => Portfolio.purchase(portfolio, 'BAYN', 1) )

      it('has value of current share price', () =>
        expect(Portfolio.value(portfolio, stubService)).toEqual(BayerValue))
    })

    describe('on multi-share purchase', () => {
      beforeEach(() => Portfolio.purchase(portfolio, 'BAYN', 42))

      it('has value of current share price', () =>
        expect(Portfolio.value(portfolio, stubService))
          .toEqual(42 * BayerValue))
    })

    describe('on multi-symbol purchase', () => {
      beforeEach(() => {
        Portfolio.purchase(portfolio, 'BAYN', 42)
        Portfolio.purchase(portfolio, 'IBM', 10)
      })

      it('totals values for all symbols', () => {
        expect(Portfolio.value(portfolio, stubService))
          .toEqual(42 * BayerValue + 10 * IbmValue)
      })
    })
  })

  it('is empty when no purchases', () => {
    expect(Portfolio.isEmpty(portfolio)).toBeTruthy()
  })

  it('is not empty after purchase', () => {
    portfolio = Portfolio.purchase(portfolio)

    expect(Portfolio.isEmpty(portfolio)).toBeFalsy()
  })

  it('has no unique symbols when it is empty', () => {
    expect(Portfolio.uniqueSymbolCount(portfolio)).toBe(0)
  })

  describe('with one symbol A purchase', () => {
    const initialShareBalance = 15
    beforeEach(() => {
      portfolio = Portfolio.purchase(portfolio, "A", initialShareBalance)
    })

    it('has 1 unique symbol after purchase', () => {
      expect(Portfolio.uniqueSymbolCount(portfolio)).toBe(1)
    })

    it('increases symbol count with each purchase', () => {
      portfolio = Portfolio.purchase(portfolio, "B", 10)

      expect(Portfolio.uniqueSymbolCount(portfolio)).toBe(2)
    })

    it('does not increase symbol count on same-symbol purchase', () => {
      portfolio = Portfolio.purchase(portfolio, "A", 10)

      expect(Portfolio.uniqueSymbolCount(portfolio)).toBe(1)
    })

    it('share count for a given symbol', () => {
      portfolio = Portfolio.purchase(portfolio, "A", 15)

      expect(Portfolio.shareCount(portfolio, 'A')).toBe(initialShareBalance + 15)
    })

    it('increases quantity for given symbol', () => {
      portfolio = Portfolio.purchase(portfolio, "A", 10)
      portfolio = Portfolio.purchase(portfolio, "A", 10)

      expect(Portfolio.shareCount(portfolio, 'A')).toBe(
        initialShareBalance + 10 + 10)
    })

    it('share count for a unpurchase symbol', () => {

      expect(Portfolio.shareCount(portfolio, 'C')).toBe(0)
    })
  })

})