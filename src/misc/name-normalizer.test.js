import { normalize } from './name-normalizer'

describe('a name normalizer', () => {
  it('returns empty when passed empty string', () => {
    expect(normalize('')).toEqual('')
  })

  it('returns single word name', () => {
    expect(normalize('Plato')).toEqual('Plato')
  })

  it('swaps first and last names', () => {
    expect(normalize('Haruki Murakami')).toEqual('Murakami, Haruki')
  })

  it('trims leading and trailing whitespace', () => {
    expect(normalize('  Big Boi   ')).toEqual('Boi, Big')
  })

  it('initializes middle name', () => {
    expect(normalize('Henry David Thoreau')).toEqual('Thoreau, Henry D.')
  })

  it('does not initialize one letter middle name', () => {
    expect(normalize('Harry S Truman')).toEqual('Truman, Harry S')
  })

  it('initializes each of multiple middle names', () => {
    expect(normalize('Julia Scarlett Elizabeth Louis-Dreyfus')).toEqual('Louis-Dreyfus, Julia S. E.')
  })

  it('appends suffixes to end', () => {
    expect(normalize('Martin Luther King, Jr.')).toEqual('King, Martin L., Jr.')
  })

  it('throws when name contains two commas', () => {
    expect(() => normalize('Thurston, Howell, III')).toThrow()
  })
})

// Extra Credit:
//  salutations, e.g. Mr. Edmund Langr. U.S. Salutations are recognized as
//     one of Mr., Mrs., Ms., and Dr.--either with or without the period.
//     Anything else should be recognized as a first name

// What other tests should you write? Not new features but things you know as a programmer
// that you probably needed? (Or do you need them? Discuss.)
