import { convert } from './roman'

describe('a roman converter', () => {
  it('converts arabic to roman strings', () => {
    expect(convert(1)).toEqual('I')
    expect(convert(2)).toEqual('II')
    expect(convert(3)).toEqual('III')
    expect(convert(4)).toEqual('IV')

    expect(convert(10)).toEqual('X')
    expect(convert(11)).toEqual('XI')
    expect(convert(20)).toEqual('XX')

    expect(convert(300)).toEqual('CCC')

    expect(convert(2050)).toEqual('MML')
    expect(convert(3773)).toEqual('MMMDCCLXXIII')
  })
})
