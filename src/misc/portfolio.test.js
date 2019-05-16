import { when } from 'jest-when'
import * as Portfolio from './portfolio'

describe('a stock portfolio', () => {
  let portfolio;

  beforeEach(() => {
    portfolio = Portfolio.create()
  })

  describe('portfolio value', () => {
    const mockedStockValues = { APPL: 1600, BAYER: 16 }
    const stockPriceLookUpServiceStub = jest.fn()

    beforeEach(() => {
      stockPriceLookUpServiceStub.mockClear()
      const { APPL, BAYER } = mockedStockValues

      when(stockPriceLookUpServiceStub).calledWith("APPL").mockReturnValue(APPL)
      when(stockPriceLookUpServiceStub).calledWith("BAYER").mockReturnValue(BAYER)
    })

    describe('when empty', () => {
      it('retun 0', () =>{
        expect(Portfolio.value(portfolio, stockPriceLookUpServiceStub)).toBe(0)
      })
    })

    describe('on single share purchase', () => {
      it('returns the value of that share', () => {
        Portfolio.purchase(portfolio, "APPL", 1)

        expect(Portfolio.value(portfolio, stockPriceLookUpServiceStub)).toBe(mockedStockValues.APPL)
      })
    })

    describe('on multiple share purchase of one stock', () => {
      it('returns the total value of the shares', () => {
        const shareQuantity = 4
        Portfolio.purchase(portfolio, "APPL", shareQuantity)

        expect(Portfolio.value(portfolio, stockPriceLookUpServiceStub)).toBe(mockedStockValues.APPL * shareQuantity)
      })
    })

    describe('on multiple share purchase of multiple stocks', () => {
      it('returns the total value of the shares', () => {
        const shareQuantity = 4
        Portfolio.purchase(portfolio, "APPL", shareQuantity)
        Portfolio.purchase(portfolio, "BAYER", 5)
        const expectedTotal = (mockedStockValues.APPL * shareQuantity) + (mockedStockValues.BAYER * 5)

        expect(Portfolio.value(portfolio, stockPriceLookUpServiceStub)).toBe(expectedTotal)
      })

      it('calls the stub service for each purchased stock', () => {
        const shareQuantity = 4
        Portfolio.purchase(portfolio, "APPL", shareQuantity)
        Portfolio.purchase(portfolio, "BAYER", 5)

        Portfolio.value(portfolio, stockPriceLookUpServiceStub)

        expect(stockPriceLookUpServiceStub.mock.calls.length).toBe(2)
      })
    })

    describe('one single share sell', () => {

      beforeEach(()=>{
        Portfolio.purchase(portfolio, "APPL", 4)
        Portfolio.purchase(portfolio, "BAYER", 5)
        Portfolio.sell(portfolio, "APPL", 1)
      })

      it('return the remaining shares', () => {
        expect(Portfolio.shareCount(portfolio, "APPL")).toBe((4-1))

      })

      it('return the value of remaining shares', () => {
        const expectedValue = (mockedStockValues.APPL * Portfolio.shareCount(portfolio, "APPL")) + (mockedStockValues.BAYER * Portfolio.shareCount(portfolio, "BAYER"))
        expect(Portfolio.value(portfolio, stockPriceLookUpServiceStub)).toBe(expectedValue)

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