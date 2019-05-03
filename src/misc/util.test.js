import * as Util from './util'

describe('group by', () => {
  const rank = s => s[0]

  it('splits groups using function', () => {
    expect(Util.groupBy(['2D', '2C', '2S', '2H', 'JH'], rank))
      .toEqual({
        '2': ['2D', '2C', '2S', '2H'],
        'J': ['JH']
      })
  })

  it('provides one group if all same', () =>
    expect(Util.groupBy(['2D', '2C', '2S', '2C', '2H'], rank))
      .toEqual({'2': ['2D', '2C', '2S', '2C', '2H']}))
})

describe('range', () => {
  it('populates an array in increasing order', () =>{
    expect(Util.range(4, 3)).toEqual([4, 5, 6])
  })

  it('populates an array in decreasing order', () =>{
    expect(Util.range(10, -3)).toEqual([10, 9, 8])
  })
})