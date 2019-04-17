const numberOfCharactersInString = (s, char) =>
  (s.match(new RegExp(char, 'g'))||[]).length;

const parts = name => name.split(' ')

const last = name => parts(name)[parts(name).length - 1]

const first = name => parts(name)[0]

const middle = name => parts(name).slice(1, -1)

const baseNameAndSuffix = name => {
  let [baseName, suffix] = name.split(',')
  return suffix
    ? [baseName, `,${suffix}`]
    : [baseName, '']
}

const initial = namePart => namePart.length === 1 ? ` ${namePart}` : ` ${namePart[0]}.`

const middleInitial = name => middle(name).map(initial).join('')

const isMononym = name => parts(name).length === 1

const throwOnTooManyCommas = fullName => {
  if (numberOfCharactersInString(fullName, ',') > 1)
    throw new Error()
}

export const normalize = fullName => {
  throwOnTooManyCommas(fullName)

  const [baseName, suffix] = baseNameAndSuffix(fullName.trim())

  if (isMononym(baseName)) return `${baseName}${suffix}`
  return `${last(baseName)}, ${first(baseName)}${middleInitial(baseName)}${suffix}`
}
