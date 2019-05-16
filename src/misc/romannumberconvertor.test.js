import  { convert }  from './romannumberconvertor'

describe('roman number convertor', () =>{
  xit('test for 0 ', function () {
    expect(convert(0)).toThrow()
  })
  it('test for 1 ', function () {
    expect(convert(1)).toBe('I')
  })

  it('test for 2 ', function () {
    expect(convert(2)).toBe('II')
  })

  it('test for 3 ', function () {
    expect(convert(3)).toBe('III')
  })

  it('test for 6 ', function () {
    expect(convert(6)).toBe('VI')
  })
  xit('test for 7 ', function () {
    expect(convert(7)).toBe('VII')
  })

  it('test for 8 ', function () {
    expect(convert(8)).toBe('VIII')
  })
  it('test for 9 ', function () {
    expect(convert(9)).toBe('IX')
  })

  it('test for 13 ', function () {
    expect(convert(13)).toBe('XIII')
  })

  it('test for 37 ', function () {
    expect(convert(37)).toBe('XXXVII')
  })

  it('test for 297 ', function () {
    expect(convert(297)).toBe('CCXCVII')

  })

  it('test for 4549 ', function () {
    expect(convert(4549)).toBe('MMMMDXLIX')

  })

  it('test for 4000 ', function () {
    expect(convert(4000)).toBe('MMMM')

  })

})