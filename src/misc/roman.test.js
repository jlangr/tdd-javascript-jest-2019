import * as Roman from './roman'

describe('Roman', () => {
  // can parameterized test work here?
  it('converts to roman from arabic numbers', () => {
    expect(Roman.convert(1)).toEqual('I')
    expect(Roman.convert(2)).toEqual('II')
    expect(Roman.convert(3)).toEqual('III')
    expect(Roman.convert(4)).toEqual('IV')
    expect(Roman.convert(5)).toEqual('V')
    expect(Roman.convert(9)).toEqual('IX')
    expect(Roman.convert(10)).toEqual('X')
    expect(Roman.convert(11)).toEqual('XI')
    expect(Roman.convert(20)).toEqual('XX')
    expect(Roman.convert(40)).toEqual('XL')
    expect(Roman.convert(50)).toEqual('L')
    expect(Roman.convert(90)).toEqual('XC')
    expect(Roman.convert(100)).toEqual('C')
    expect(Roman.convert(400)).toEqual('CD')
    expect(Roman.convert(500)).toEqual('D')
    expect(Roman.convert(900)).toEqual('CM')
    expect(Roman.convert(1000)).toEqual('M')
    expect(Roman.convert(999)).toEqual('CMXCIX')
    expect(Roman.convert(1138)).toEqual('MCXXXVIII')
  })
})