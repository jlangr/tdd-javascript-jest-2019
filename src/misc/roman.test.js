import { convert } from './roman'

describe('a roman number converter', () => {
  it('converts 1 from arabic to roman', () => {
    expect(convert(1)).toEqual('I')
  })

  it('converts 2 from arabic to roman', () => {
    expect(convert(2)).toEqual('II')
    expect(convert(3)).toEqual('III')
    expect(convert(4)).toEqual('IV')
    expect(convert(5)).toEqual('V')
    expect(convert(10)).toEqual('X')
    expect(convert(20)).toEqual('XX')
    expect(convert(11)).toEqual('XI')
    expect(convert(200)).toEqual('CC')
    expect(convert(210)).toEqual('CCX')
    expect(convert(99)).toEqual('XCIX')
    expect(convert(3754)).toEqual('MMMDCCLIV')
  })
})