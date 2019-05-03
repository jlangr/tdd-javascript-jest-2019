import * as Hand from './hand'
import * as Card from './card'

describe('sorting', () => {
  it('returns in high-to-low order', () => {
    expect(Hand.sort(['4D', '10C', '9S', 'QH', 'AS'])).toEqual(['AS', 'QH', '10C', '9S', '4D'])
  })
})

describe('hand contains', () => {
  it('pair', () => {
    expect(Hand.containsPair(['4D', '10C', '9S', 'QH', 'AS'])).toBe(false)
    expect(Hand.containsPair(['4D', '10C', '4S', 'QH', 'AS'])).toBe(true)
  })

  it('two pair', () => {
    expect(Hand.containsTwoPair(['4D', '10C', '4S', '9H', 'AS'])).toBe(false)
    expect(Hand.containsTwoPair(['4D', '10C', '4S', 'QH', '10S'])).toBe(true)
  })

  it('set', () => {
    expect(Hand.containsSet(['4D', '10C', '4S', '9H', 'AS'])).toBe(false)
    expect(Hand.containsSet(['4D', '10C', '4S', 'QH', '4C'])).toBe(true)
  })

  describe('straight', () => {
    expect(Hand.containsStraight(['6D', '10C', '7S', '9H', '8C'])).toBe(true)
    expect(Hand.containsStraight(['6D', '10C', '7S', '7H', '8C'])).toBe(false)
  })

  describe('flush', () => {
    expect(Hand.containsFlush(['6D', '10D', '7D', '9D', 'JD'])).toBe(true)
    expect(Hand.containsFlush(['6D', '10C', '7D', '9D', 'JD'])).toBe(false)
  })

  describe('full house', () => {
    expect(Hand.containsFullHouse(['6D', '10D', '6C', '10S', '10C'])).toBe(true)
    expect(Hand.containsFullHouse(['6D', '10C', '6C', '10D', 'JD'])).toBe(false)
  })

  describe('quads', () => {
    expect(Hand.containsQuads(['6D', '6H', '6C', '10S', '6S'])).toBe(true)
    expect(Hand.containsQuads(['6D', '10C', '6C', '10D', 'JD'])).toBe(false)
    expect(Hand.containsQuads(['6D', '10C', '6C', '10D', '6C'])).toBe(false)
  })

  describe('straight flush', () => {
    expect(Hand.containsStraightFlush(['6D', '7D', '9D', '8D', '5D'])).toBe(true)
    expect(Hand.containsStraightFlush(['6D', '7D', '9D', '10D', 'JD'])).toBe(false)
  })
})

describe('hand description', () => {
  it('describes as x high', () => {
    expect(Hand.describe(['4D', '10C', '9S', 'QH', 'AS'])).toEqual('ace high')
    expect(Hand.describe(['4D', '10C', '9S', '3H', '2S'])).toEqual('10 high')
  })
})

describe('description functions', () => {
  it('describes as pair', () => {
    expect(Hand.pairDescription(['4D', '10C', '4H', 'QH', 'AS'])).toEqual('pair of 4s')
  })

  it('describes as two pair', () => {
    expect(Hand.twoPairDescription(['5D', 'JD', '10S', '10D', '5H'])).toEqual('two pair, 10s and 5s')
  })

  it('describes as flush', () => {
    expect(Hand.flushDescription(['5D', '9D', '10D', '8D', '3D'])).toEqual('10-high flush')
  })

  it('describes as straight', () => {
    expect(Hand.straightDescription(['6D', '9H', '10S', '8D', '7C'])).toEqual('straight to the 10')
  })

  it('describes as set', () => {
    expect(Hand.setDescription(['4D', '4C', '4H', 'QH', 'AS'])).toEqual('set of 4s')
  })

  it('describes as full house', () => {
    expect(Hand.fullHouseDescription(['4D', '3C', '4H', '3H', '3S'])).toEqual('full house, 3s over 4s')
  })

  it('describes as four of a kind', () => {
    expect(Hand.quadsDescription(['4D', '4C', '4H', 'QH', '4S'])).toEqual('four of a kind: 4s')
  })
})

describe('sorted group by', () => {
  it('uses run length as primary sort characteristic', () => {
    expect(Hand.sortedGroups(['4H', '2D', '2C', '2S', '2H'], Card.numericRank))
      .toEqual([
        ['2', ['2D', '2C', '2S', '2H']],
        ['4', ['4H']]
      ])
  })

  it('considers numericRank', () => {
    expect(Hand.sortedGroups(['5D', 'JD', '10S', '10D', '5H'], Card.rank))
      .toEqual([
        ['10', ['10S', '10D']],
        ['5', ['5D', '5H']],
        ['J', ['JD']]
      ])
  })
})
