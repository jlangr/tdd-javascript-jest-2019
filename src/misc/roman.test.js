import { convert } from './roman'

describe('a roman numeral converter', () => {

  it('converts arabic to roman numbers', () => {
    expect(convert(1)).toEqual('I')
    expect(convert(2)).toEqual('II')
    expect(convert(3)).toEqual('III')
    expect(convert(5)).toEqual('V')
    expect(convert(10)).toEqual('X')
    expect(convert(20)).toEqual('XX')
    expect(convert(11)).toEqual('XI')
    expect(convert(50)).toEqual('L')
    expect(convert(3849)).toEqual('MMMDCCCXLIX')
    expect(convert(3999)).toEqual('MMMCMXCIX')
  })
})