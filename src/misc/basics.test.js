describe('some javascript fundamentals', () => {
  it('supports basic math', () => {
    expect(4 * 8).toEqual(32)
  })

  it('appends an item to an array using push', () => {
    const numbers = [12, 1, 1, 1, 2, 1, 3]

    numbers.push(1)

    expect(numbers).toEqual([12, 1, 1, 1, 2, 1, 3, 1])
  })

  it('doubles each element an array of numbers ', () => {
    const numbers = [2, 5, 10, 105]

    const result = numbers.map(number => number * 2)

    expect(result).toEqual([4, 10, 20, 210])
  })

  it('handles interesting float-point number results', () => {
    const result = 0.1 + 0.2

    expect(result).toBeCloseTo(0.3)
  })
})