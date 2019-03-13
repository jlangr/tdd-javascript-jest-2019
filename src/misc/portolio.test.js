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

  it('is not empty after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

    expect(Portfolio.isEmpty(portfolio)).toBe(false)
  })

  it('has symbol count 0 when created', () => {
    expect(Portfolio.symbolCount(portfolio)).toEqual(0)
  })

  it('increases symbol count after purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)

    expect(Portfolio.symbolCount(portfolio)).toEqual(1)
  })

  it('increments symbol count with each unique symbol purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio, 'IBM', 20)

    expect(Portfolio.symbolCount(portfolio)).toEqual(2)
  })

  it('does not increase symbol count with same symbol purchase', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 20)

    expect(Portfolio.symbolCount(portfolio)).toEqual(1)
  })

  it('returns shares for purchased symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 42)

    expect(Portfolio.shares(portfolio, 'BAYN')).toEqual(42)
  })

  it('returns 0 for shares of unpurchased symbol', () => {
    expect(Portfolio.shares(portfolio, 'BAYN')).toEqual(0)
  })

  it('accumulates shares by symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 30)
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 12)

    expect(Portfolio.shares(portfolio, 'BAYN')).toEqual(42)
  })

  it('reduces shares on sell', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 30)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 10)

    expect(Portfolio.shares(portfolio, 'BAYN')).toEqual(20)
  })

  it('throws when selling too many shares', () => {
    expect(() => {
      Portfolio.sell(portfolio, 'BAYN', 1)
    }).toThrow(RangeError)
  })

  it('reduces count when selling all shares of symbol', () => {
    portfolio = Portfolio.purchase(portfolio, 'BAYN', 10)
    portfolio = Portfolio.sell(portfolio, 'BAYN', 10)

    expect(Portfolio.symbolCount(portfolio)).toEqual(0)
  })
})
