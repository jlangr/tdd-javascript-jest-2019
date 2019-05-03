import * as Card from './card'
import * as Util from './util'
import * as _ from 'lodash'
import memoize from 'fast-memoize'

export const sort = memoize(hand => hand.sort((card1, card2) => Card.numericRank(card1) < Card.numericRank(card2)))
export const sortedGroups = memoize(hand => sortByRunLengthThenRank(Util.groupBy(hand, Card.rank)))

const sortByRunLengthThenRank = groups =>
  Object.entries(groups).sort(([rank1, group1], [rank2, group2]) => {
    if (group1.length === group2.length)
      return Card.numberRankFromRank(rank1) < Card.numberRankFromRank(rank2)
    return group1.length < group2.length
  })

const uniqueRankCount = hand => new Set(hand.map(Card.numericRank)).size
const uniqueSuitCount = hand => new Set(hand.map(Card.suit)).size
const hasGroupCount = (hand, count) => sortedGroups(hand).length === count
const lengthOfFirstGroup = (hand)  => lengthOfGroup(sortedGroups(hand)[0])
const highCard = cards => sort(cards)[0]
const rankOfRun = (sortedGroups, i) => sortedGroups[i][0]
const ranksByRunLength = hand => sortedGroups(hand).map(([rank]) => rank)
const lengthOfGroup = group => group[1].length

export const containsPair = hand => uniqueRankCount(hand) === 4
export const containsTwoPair = hand => hasGroupCount(hand, 3) && lengthOfFirstGroup(hand) === 2
export const containsSet = hand => lengthOfFirstGroup(hand) === 3
export const containsStraight = hand =>
  _.isEqual(Util.range(Card.numericRank(highCard(hand)), -5), hand.map(Card.numericRank))
export const containsFlush = hand => uniqueSuitCount(hand) === 1
export const containsQuads = hand => lengthOfFirstGroup(hand) === 4
export const containsFullHouse = hand => hasGroupCount(hand, 2) && lengthOfFirstGroup(hand) === 3
export const containsStraightFlush = hand => containsStraight(hand) && containsFlush(hand)

export const quadsDescription = hand => `four of a kind: ${rankOfRun(sortedGroups(hand), 0)}s`
export const fullHouseDescription = hand => {
  const [over, under] = ranksByRunLength(hand)
  return `full house, ${over}s over ${under}s`
}
export const flushDescription = hand => `${Card.name(highCard(hand))}-high flush`
export const straightDescription = hand => `straight to the ${Card.name(highCard(hand))}`
export const setDescription = hand => `set of ${rankOfRun(sortedGroups(hand), 0)}s`
export const pairDescription = hand => `pair of ${rankOfRun(sortedGroups(hand), 0)}s`
export const highCardDescription = hand => `${Card.name(highCard(hand))} high`
export const twoPairDescription = hand =>
  `two pair, ${rankOfRun(sortedGroups(hand), 0)}s and ${rankOfRun(sortedGroups(hand), 1)}s`

const hands = [
  { test: containsQuads, description: quadsDescription },
  { test: containsFullHouse, description: fullHouseDescription },
  { test: containsFlush, description: flushDescription },
  { test: containsStraight, description: straightDescription },
  { test: containsSet, description: setDescription },
  { test: containsTwoPair, description: twoPairDescription },
  { test: containsPair, description: pairDescription },
  { test: () => true, description: highCardDescription }
]

export const describe = hand => hands.find(({test}) => test(hand)).description(hand)

