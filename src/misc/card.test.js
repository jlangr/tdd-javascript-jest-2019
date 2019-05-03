import * as Card from './card'

describe('a card', () => {
  it('has a numericRank', () => {
    expect(Card.numericRank('AC')).toEqual(14)
    expect(Card.numericRank('KD')).toEqual(13)
    expect(Card.numericRank('10S')).toEqual(10)
    expect(Card.numericRank('2S')).toEqual(2)
  })

  it('returns difference when comparing', () => {
    expect(Card.compareRank('AC', 'AS')).toEqual(0)
    expect(Card.compareRank('10S', '3S')).toEqual(7)
    expect(Card.compareRank('JD', 'QC')).toEqual(-1)
  })
})