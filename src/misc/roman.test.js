import { convert } from './roman'

describe('a roman converter', () => {
  it('converts to roman from arabic', () => {
    expect(convert(1)).toEqual('I')
    expect(convert(2)).toEqual('II')
    expect(convert(3)).toEqual('III')
    expect(convert(4)).toEqual('IV')
    expect(convert(5)).toEqual('V')
    expect(convert(9)).toEqual('IX')
    expect(convert(10)).toEqual('X')
    expect(convert(11)).toEqual('XI')
    expect(convert(20)).toEqual('XX')
    expect(convert(50)).toEqual('L')
    expect(convert(200)).toEqual('CC')
    expect(convert(500)).toEqual('D')
    expect(convert(1000)).toEqual('M')
    expect(convert(1307)).toEqual('MCCCVII')
    expect(convert(2019)).toEqual('MMXIX')
    expect(convert(3999)).toEqual('MMMCMXCIX')
  })
})

