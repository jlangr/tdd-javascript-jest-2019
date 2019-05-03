// yes this could be coded up (and it was).
// a table increases speed, if that matters.
// It won't ever have to change, and results
// in less/simpler code
const cardInfo = {
  '2': { rank: 2, name: '2' },
  '3': { rank: 3, name: '3' },
  '4': { rank: 4, name: '4' },
  '5': { rank: 5, name: '5' },
  '6': { rank: 6, name: '6' },
  '7': { rank: 7, name: '7' },
  '8': { rank: 8, name: '8' },
  '9': { rank: 9, name: '9' },
  '10': { rank: 10, name: '10' },
  'J': { rank: 11, name: 'jack' },
  'Q': { rank: 12, name: 'queen' },
  'K': { rank: 13, name: 'king' },
  'A': { rank: 14, name: 'ace' }
}

// TODO test
export const numberRankFromRank = rank => cardInfo[rank].rank

// TODO test
export const rank = card => card.slice(0, -1)

// TODO test
export const suit = card => card.slice(-1)

export const numericRank = card => cardInfo[rank(card)].rank

export const compareRank = (card1, card2) => numericRank(card1) - numericRank(card2)

export const name = card => cardInfo[rank(card)].name
