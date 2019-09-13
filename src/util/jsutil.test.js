import { removeKey } from './jsutil'

describe('removeKey', () => {
  it('returns new object without key', () => {
    expect(removeKey({ a: 1, b: 2 }, 'a')).toEqual({ b: 2 })
  })

  it('does nothing if key not found', () => {
    expect(removeKey({ a: 1 }, 'b')).toEqual({ a: 1 })
  })
})
