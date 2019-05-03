import * as _ from 'lodash'

// use lodash instead
export const groupBy = (coll, groupingFn) =>
  coll.reduce((groups, each) => {
    const key = groupingFn(each)
    return groups[key]
      ? {...groups, [key]: [...groups[key], each]}
      : {...groups, [key]: [each]}
  }, {})

export const range = (start, count) => {
  return _.range(start, start + count)
}
